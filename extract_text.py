from pdfminer.high_level import extract_text
import sys

def extract_text_from_pdf(pdf_path, output_path):
    try:
        text = extract_text(pdf_path)
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(text)
        print(f'Text extracted successfully to {output_path}')
    except Exception as e:
        print(f'Error extracting text: {e}')
        sys.exit(1)

if __name__ == '__main__':
    pdf_path = 'source/original/101basiccomputergames.pdf'
    output_path = 'source/extracted/fulltext.txt'
    extract_text_from_pdf(pdf_path, output_path)