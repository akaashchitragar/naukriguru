import io
from io import BytesIO
from PyPDF2 import PdfReader
from typing import Union, Dict
import hashlib
from datetime import datetime, timedelta
import concurrent.futures

# Simple in-memory cache for PDF extraction results
_pdf_cache: Dict[str, tuple] = {}
_cache_ttl = timedelta(hours=24)  # Cache results for 24 hours

def _generate_cache_key(file_content: Union[bytes, BytesIO]) -> str:
    """Generate a unique cache key based on file content"""
    if isinstance(file_content, BytesIO):
        content = file_content.getvalue()
    else:
        content = file_content
    return hashlib.md5(content).hexdigest()

def _extract_page_text(page) -> str:
    """Extract text from a single PDF page"""
    try:
        return page.extract_text() + "\n"
    except Exception as e:
        print(f"Error extracting text from page: {str(e)}")
        return ""

def extract_text_from_pdf(file_content: Union[bytes, BytesIO]) -> str:
    """
    Extract text from a PDF file

    Args:
        file_content: PDF file content as bytes or BytesIO

    Returns:
        str: Extracted text from the PDF
    """
    try:
        # Check cache first
        cache_key = _generate_cache_key(file_content)
        if cache_key in _pdf_cache:
            cached_text, timestamp = _pdf_cache[cache_key]
            if datetime.now() - timestamp < _cache_ttl:
                print("Using cached PDF extraction result")
                return cached_text

        # Convert bytes to BytesIO if needed
        if isinstance(file_content, bytes):
            file_content = io.BytesIO(file_content)

        # Create PDF reader object
        pdf_reader = PdfReader(file_content)
        
        # Use parallel processing for multi-page PDFs
        if len(pdf_reader.pages) > 1:
            with concurrent.futures.ThreadPoolExecutor() as executor:
                text_parts = list(executor.map(_extract_page_text, pdf_reader.pages))
                text = "".join(text_parts)
        else:
            # For single page PDFs, just extract directly
            text = _extract_page_text(pdf_reader.pages[0]) if pdf_reader.pages else ""

        if not text.strip():
            result = ("No text could be extracted from the PDF. "
                    "The file might be scanned or image-based.")
        else:
            result = text
            
        # Cache the result
        _pdf_cache[cache_key] = (result, datetime.now())
        
        return result

    except Exception as e:
        error_message = f"Error extracting text from PDF: {str(e)}"
        print(error_message)
        return error_message
