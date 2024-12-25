from tabula import read_pdf

df = read_pdf("/home/ting/la/pdfs/11302.pdf", encoding="big5hkscs", pages=[48, 49, 50, 51])

print(df)