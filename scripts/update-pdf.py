import pypdf
from pypdf.generic import (
    DictionaryObject,
    NameObject,
    ArrayObject,
    FloatObject,
    NumberObject,
    TextStringObject,
    DecodedStreamObject,
)
import os

def make_rounded_rect(x, y, w, h, r=3.0):
    k = r * 0.55228475
    return (
        f".121569 .121569 .180392 RG\n"
        f".8 w\n"
        f"n\n"
        f"{x + r:.4f} {y:.4f} m\n"
        f"{x + w - r:.4f} {y:.4f} l\n"
        f"{x + w - r + k:.4f} {y:.4f} {x + w:.4f} {y + r - k:.4f} {x + w:.4f} {y + r:.4f} c\n"
        f"{x + w:.4f} {y + h - r:.4f} l\n"
        f"{x + w:.4f} {y + h - r + k:.4f} {x + w - r + k:.4f} {y + h:.4f} {x + w - r:.4f} {y + h:.4f} c\n"
        f"{x + r:.4f} {y + h:.4f} l\n"
        f"{x + r - k:.4f} {y + h:.4f} {x:.4f} {y + h - r + k:.4f} {x:.4f} {y + h - r:.4f} c\n"
        f"{x:.4f} {y + r:.4f} l\n"
        f"{x:.4f} {y + r - k:.4f} {x + r - k:.4f} {y:.4f} {x + r:.4f} {y:.4f} c\n"
        f"h\n"
        f"S"
    )

def create_link_annot(x, y, w, h, url):
    return DictionaryObject({
        NameObject('/Type'): NameObject('/Annot'),
        NameObject('/Subtype'): NameObject('/Link'),
        NameObject('/Rect'): ArrayObject([
            FloatObject(x),
            FloatObject(y),
            FloatObject(x + w),
            FloatObject(y + h),
        ]),
        NameObject('/Border'): ArrayObject([
            NumberObject(0),
            NumberObject(0),
            NumberObject(0),
        ]),
        NameObject('/A'): DictionaryObject({
            NameObject('/Type'): NameObject('/Action'),
            NameObject('/S'): NameObject('/URI'),
            NameObject('/URI'): TextStringObject(url),
        }),
    })

def main():
    src_pdf = 'public/docs/Hardik_Bhaskar_Portfolio.pdf'
    reader = pypdf.PdfReader(src_pdf)
    writer = pypdf.PdfWriter()

    # ── Page 1 Transformation ──────────────────────────────────
    page1 = reader.pages[0]
    p1_stream = page1.get_contents().get_data().decode('latin1')

    # Header block replacement (from line 19 to line 96)
    # Target: from 'BT /F2 8.2 Tf 9.84 TL ET' to 'BT 1 0 0 1 398.4 704.1898 Tm (New Delhi, India) Tj T* ET'
    old_header_start = 'BT /F2 8.2 Tf 9.84 TL ET\n.133333 .827451 .933333 rg\nBT 1 0 0 1 42 781.8898 Tm (// AVAILABLE FOR FREELANCE & LONG-TERM CONTRACTS) Tj T* ET'
    old_header_end = 'BT 1 0 0 1 398.4 704.1898 Tm (New Delhi, India) Tj T* ET'

    idx_start = p1_stream.find(old_header_start)
    idx_end = p1_stream.find(old_header_end) + len(old_header_end)

    if idx_start == -1 or idx_end == -1:
        raise ValueError("Could not locate Page 1 header block in content stream!")

    # Calculate pill dimensions
    # Courier fixed char width at 7.2pt = 4.32pt
    pills = [
        {"text": "hardikbhaskar.vercel.app", "url": "https://hardikbhaskar.vercel.app", "chars": 24},
        {"text": "github.com/HardikBhaskar2010", "url": "https://github.com/HardikBhaskar2010", "chars": 27},
        {"text": "linkedin.com/in/hardik-bhaskar", "url": "https://www.linkedin.com/in/hardik-bhaskar-8a107a3bb/", "chars": 30},
        {"text": "New Delhi, India", "url": None, "chars": 16},
    ]

    pill_y = 696.8898
    pill_h = 15.0
    char_w = 4.32
    padding_x = 6.0
    gap = 8.0
    cur_x = 42.0

    pill_elements = []
    p1_annots_data = []

    for pill in pills:
        text_w = pill["chars"] * char_w
        box_w = text_w + (padding_x * 2)
        
        # Rounded rect box
        rect_svg = make_rounded_rect(cur_x, pill_y, box_w, pill_h, r=3.0)
        
        # Text
        text_x = cur_x + padding_x
        text_y = pill_y + 4.30
        text_svg = (
            f".611765 .639216 .686275 rg\n"
            f"BT /F4 7.2 Tf 8.64 TL ET\n"
            f"BT 1 0 0 1 {text_x:.4f} {text_y:.4f} Tm ({pill['text']}) Tj T* ET"
        )
        
        pill_elements.append(rect_svg + "\n" + text_svg)
        
        if pill["url"]:
            p1_annots_data.append((cur_x, pill_y, box_w, pill_h, pill["url"]))
        
        cur_x += box_w + gap

    pills_stream = "\n".join(pill_elements)

    new_header = (
        f"BT /F2 8.2 Tf 9.84 TL ET\n"
        f".133333 .827451 .933333 rg\n"
        f"BT 1 0 0 1 42 783.8898 Tm (// AVAILABLE FOR FREELANCE & LONG-TERM CONTRACTS) Tj T* ET\n"
        f"BT /F3 28 Tf 33.6 TL ET\n"
        f".952941 .956863 .964706 rg\n"
        f"BT 1 0 0 1 42 753.8898 Tm (Hardik Bhaskar) Tj T* ET\n"
        f"BT /F3 11.5 Tf 13.8 TL ET\n"
        f".133333 .827451 .933333 rg\n"
        f"BT 1 0 0 1 42 736.8898 Tm (Systems Architect & AI Systems Builder) Tj T* ET\n"
        f"BT /F4 8.2 Tf 9.84 TL ET\n"
        f".611765 .639216 .686275 rg\n"
        f"BT 1 0 0 1 42 723.8898 Tm (Operating Systems \\267 Autonomous AI \\267 Intelligent Systems) Tj T* ET\n"
        f"{pills_stream}"
    )

    p1_stream = p1_stream[:idx_start] + new_header + p1_stream[idx_end:]

    # Page 1 Footer replacement
    old_p1_footer = '(lunakitsune.vercel.app  //  github.com/HardikBhaskar2010)'
    new_p1_footer = '(hardikbhaskar.vercel.app  //  github.com/HardikBhaskar2010)'
    p1_stream = p1_stream.replace(old_p1_footer, new_p1_footer)

    page1_new_contents = DecodedStreamObject()
    page1_new_contents.set_data(p1_stream.encode('latin1'))
    page1[NameObject('/Contents')] = page1_new_contents
    writer.add_page(page1)

    # Add Page 1 link annotations
    for annot_info in p1_annots_data:
        x, y, w, h, url = annot_info
        writer.add_annotation(page_number=0, annotation=create_link_annot(x, y, w, h, url))

    # Add footer link annotations on page 1
    # hardikbhaskar.vercel.app at x=42, y=18, w=110, h=15
    writer.add_annotation(page_number=0, annotation=create_link_annot(42, 18, 110, 15, "https://hardikbhaskar.vercel.app"))
    # github.com/HardikBhaskar2010 at x=170, y=18, w=125, h=15
    writer.add_annotation(page_number=0, annotation=create_link_annot(170, 18, 125, 15, "https://github.com/HardikBhaskar2010"))

    # ── Page 2 Transformation ──────────────────────────────────
    page2 = reader.pages[1]
    p2_stream = page2.get_contents().get_data().decode('latin1')

    # Page 2 banner replacement
    # BT 1 0 0 1 242.1978 117.8898 Tm (lunakitsune.vercel.app) Tj T* ET
    old_p2_banner = 'BT 1 0 0 1 242.1978 117.8898 Tm (lunakitsune.vercel.app) Tj T* ET'
    new_p2_banner = 'BT 1 0 0 1 237.1578 117.8898 Tm (hardikbhaskar.vercel.app) Tj T* ET'
    p2_stream = p2_stream.replace(old_p2_banner, new_p2_banner)

    # Page 2 footer replacement
    p2_stream = p2_stream.replace(old_p1_footer, new_p1_footer)

    page2_new_contents = DecodedStreamObject()
    page2_new_contents.set_data(p2_stream.encode('latin1'))
    page2[NameObject('/Contents')] = page2_new_contents
    writer.add_page(page2)

    # Add Page 2 banner link annotation
    writer.add_annotation(page_number=1, annotation=create_link_annot(235, 112, 125, 18, "https://hardikbhaskar.vercel.app"))
    # Add footer link annotations on page 2
    writer.add_annotation(page_number=1, annotation=create_link_annot(42, 18, 110, 15, "https://hardikbhaskar.vercel.app"))
    writer.add_annotation(page_number=1, annotation=create_link_annot(170, 18, 125, 15, "https://github.com/HardikBhaskar2010"))

    # ── PDF Metadata ───────────────────────────────────────────
    title = 'Hardik Bhaskar - Systems Architect & AI Systems Builder'
    author = 'Hardik Bhaskar'
    subject = 'Portfolio - Systems Architecture, AI Systems & Software Engineering'
    keywords = 'Hardik Bhaskar, Systems Architect, AI Systems Builder, Operating Systems, Autonomous AI, MahinaOS, Veronica, AEGIS'

    writer.add_metadata({
        '/Title': title,
        '/Author': author,
        '/Subject': subject,
        '/Keywords': keywords,
        '/Creator': 'Hardik Bhaskar',
        '/Producer': 'Hardik Bhaskar Portfolio Engine',
        '/CreationDate': "D:20260905195523+00'00'",
        '/ModDate': "D:20260915000000+00'00'",
    })

    # ── XMP Metadata Stream ────────────────────────────────────
    xmp_xml = f'''<?xpacket begin="\ufeff" id="W5M0MpCehiHzreSzNTczkc9d"?>
<x:xmpmeta xmlns:x="adobe:ns:meta/">
 <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
  <rdf:Description rdf:about=""
    xmlns:dc="http://purl.org/dc/elements/1.1/"
    xmlns:pdf="http://ns.adobe.com/pdf/1.3/"
    xmlns:xmp="http://ns.adobe.com/xap/1.0/">
   <dc:title>
    <rdf:Alt>
     <rdf:li xml:lang="x-default">{title}</rdf:li>
    </rdf:Alt>
   </dc:title>
   <dc:creator>
    <rdf:Seq>
     <rdf:li>{author}</rdf:li>
    </rdf:Seq>
   </dc:creator>
   <dc:description>
    <rdf:Alt>
     <rdf:li xml:lang="x-default">{subject}</rdf:li>
    </rdf:Alt>
   </dc:description>
   <pdf:Keywords>{keywords}</pdf:Keywords>
   <pdf:Producer>Hardik Bhaskar Portfolio Engine</pdf:Producer>
   <xmp:CreatorTool>Hardik Bhaskar</xmp:CreatorTool>
  </rdf:Description>
 </rdf:RDF>
</x:xmpmeta>
<?xpacket end="w"?>'''.encode('utf-8')

    xmp_stream = DecodedStreamObject()
    xmp_stream.set_data(xmp_xml)
    xmp_stream[NameObject('/Type')] = NameObject('/Metadata')
    xmp_stream[NameObject('/Subtype')] = NameObject('/XML')

    writer._root_object[NameObject('/Metadata')] = writer._add_object(xmp_stream)

    # Write out to both paths
    out_docs = 'public/docs/Hardik_Bhaskar_Portfolio.pdf'
    out_root = 'public/Hardik_Bhaskar_Portfolio.pdf'

    with open(out_docs, 'wb') as f:
        writer.write(f)

    with open(out_root, 'wb') as f:
        writer.write(f)

    print(f"Successfully generated {out_docs} and {out_root}")

if __name__ == '__main__':
    main()
