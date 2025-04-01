import io
from io import BytesIO
from PyPDF2 import PdfReader
from typing import Union, Dict, List
import concurrent.futures
import re

def _clean_extracted_text(text: str) -> str:
    """
    Clean and normalize extracted text
    
    Args:
        text: Raw extracted text
        
    Returns:
        Cleaned text
    """
    if not text:
        return ""
    
    # Replace multiple spaces with a single space
    text = re.sub(r'\s+', ' ', text)
    
    # Replace multiple newlines with a single newline
    text = re.sub(r'\n+', '\n', text)
    
    # Remove non-printable characters
    text = re.sub(r'[^\x20-\x7E\n]', '', text)
    
    # Fix common OCR artifacts
    text = re.sub(r'l\s*\n\s*l', 'll', text)
    text = re.sub(r'I\s*\n\s*I', 'II', text)
    
    return text.strip()

def _extract_page_text(page) -> str:
    """
    Extract text from a single PDF page
    
    Args:
        page: PDF page object
        
    Returns:
        Extracted text from the page
    """
    try:
        raw_text = page.extract_text()
        if raw_text:
            return raw_text + "\n"
        return ""
    except Exception as e:
        print(f"Error extracting text from page: {str(e)}")
        return ""

def extract_text_from_pdf(file_content: Union[bytes, BytesIO]) -> str:
    """
    Extract text from a PDF file with enhanced processing and fallbacks
    
    Args:
        file_content: PDF file content as bytes or BytesIO
        
    Returns:
        str: Extracted text from the PDF
    """
    try:
        # Convert bytes to BytesIO if needed
        if isinstance(file_content, bytes):
            file_content = io.BytesIO(file_content)
            
        # Reset file pointer if needed
        if hasattr(file_content, 'seek'):
            file_content.seek(0)

        # Create PDF reader object with error handling
        try:
            pdf_reader = PdfReader(file_content)
        except Exception as e:
            print(f"Error creating PDF reader: {str(e)}")
            return f"Error: Could not read the PDF file. The file may be corrupted or password-protected. {str(e)}"
        
        # Check if PDF has pages
        if not pdf_reader.pages or len(pdf_reader.pages) == 0:
            return "Error: The PDF file contains no pages."
            
        # Get total pages for logging
        total_pages = len(pdf_reader.pages)
        print(f"Extracting text from {total_pages} page{'s' if total_pages > 1 else ''}")
        
        # Extract metadata if available
        metadata = {}
        try:
            if pdf_reader.metadata:
                metadata = {
                    "title": pdf_reader.metadata.get('/Title', ''),
                    "author": pdf_reader.metadata.get('/Author', ''),
                    "creator": pdf_reader.metadata.get('/Creator', ''),
                    "producer": pdf_reader.metadata.get('/Producer', '')
                }
                print(f"PDF metadata: {metadata}")
        except Exception as meta_e:
            print(f"Error extracting metadata: {str(meta_e)}")
        
        # Use parallel processing for multi-page PDFs
        if total_pages > 1:
            # Calculate optimal max workers based on page count
            max_workers = min(total_pages, 8)  # Cap at 8 workers to avoid resource depletion
            
            with concurrent.futures.ThreadPoolExecutor(max_workers=max_workers) as executor:
                # Process pages in batches for better memory management
                batch_size = 10
                text_parts: List[str] = []
                
                for batch_start in range(0, total_pages, batch_size):
                    batch_end = min(batch_start + batch_size, total_pages)
                    batch_pages = list(pdf_reader.pages[batch_start:batch_end])
                    
                    batch_results = list(executor.map(_extract_page_text, batch_pages))
                    text_parts.extend(batch_results)
                    
                    # Log progress for long documents
                    if total_pages > 20:
                        print(f"Processed pages {batch_start+1}-{batch_end} of {total_pages}")
                
                text = "".join(text_parts)
        else:
            # For single page PDFs, just extract directly
            text = _extract_page_text(pdf_reader.pages[0])

        # Clean and process the extracted text
        cleaned_text = _clean_extracted_text(text)
        
        if not cleaned_text.strip():
            # If no text was extracted, we return a clear error message
            result = ("No text could be extracted from this PDF. "
                     "The file might be scanned or image-based without embedded text. "
                     "Try using a PDF with searchable text.")
        else:
            # Return successfully extracted and cleaned text
            result = cleaned_text
            
            # Log extraction statistics
            words = len(result.split())
            chars = len(result)
            print(f"Extracted {words} words ({chars} characters) from {total_pages} page{'s' if total_pages > 1 else ''}")
        
        return result

    except Exception as e:
        error_message = f"Error extracting text from PDF: {str(e)}"
        print(error_message)
        return error_message
