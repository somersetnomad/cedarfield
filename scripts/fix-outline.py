"""Chromium sometimes doubles a bookmark title when its heading starts a new page
("ContentsContents"). This rewrites any exactly-doubled outline titles. Needs: pip install pypdf"""
import sys
from pypdf import PdfReader, PdfWriter
from pypdf.generic import NameObject, TextStringObject
src = sys.argv[1]
w = PdfWriter(clone_from=src)
fixed = 0
def visit(node):
    global fixed
    while node is not None:
        o = node.get_object()
        t = str(o.get('/Title', ''))
        h = len(t) // 2
        if len(t) > 3 and len(t) % 2 == 0 and t[:h] == t[h:]:
            o[NameObject('/Title')] = TextStringObject(t[:h]); fixed += 1
        if '/First' in o: visit(o['/First'])
        node = o.get('/Next')
root = w._root_object
if '/Outlines' in root and '/First' in root['/Outlines'].get_object():
    visit(root['/Outlines'].get_object()['/First'])
w.write(src)
print('outline titles fixed:', fixed)
