import io
from io import BytesIO
from PyPDF2 import PdfReader
from typing import Union


def extract_text_from_pdf(file_content: Union[bytes, BytesIO]) -> str:
    """
    Extract text from a PDF file

    Args:
        file_content: PDF file content as bytes or BytesIO

    Returns:
        str: Extracted text from the PDF
    """
    try:
        # Convert bytes to BytesIO if needed
        if isinstance(file_content, bytes):
            file_content = io.BytesIO(file_content)

        # Create PDF reader object
        pdf_reader = PdfReader(file_content)

        # Extract text from all pages
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text() + "\n"

        if not text.strip():
            return ("No text could be extracted from the PDF. "
                    "The file might be scanned or image-based.")

        return text

    except Exception as e:
        error_message = f"Error extracting text from PDF: {str(e)}"
        print(error_message)
        return error_message
