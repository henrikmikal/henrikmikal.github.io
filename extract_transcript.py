from pdf2image import convert_from_path
from pathlib import Path

pdf_path = 'utdanning/dokumenter/no/karakterutskrift.pdf'
output_dir = 'utdanning/assets/images'
Path(output_dir).mkdir(parents=True, exist_ok=True)

images = convert_from_path(pdf_path, dpi=150)
print(f'Converted {len(images)} pages')
for i, img in enumerate(images):
    img.save(f'{output_dir}/transcript_page_{i+1}.png', 'PNG')
    print(f'Saved page {i+1} as transcript_page_{i+1}.png')
