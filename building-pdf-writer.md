# Building a PDF writer

A PDF file is basically a set of object serialised in a specific format similar to PostScript. Our initial goal is to be able to place text in a PDF by writing the required objects in the correct format but today we’ll just start with the overall layout of the PDF file source.

The first thing we write to the file is the PDF header which consists of the PDF version and 4 binary characters to ensure readers know the file contains binary.

```
%PDF-1.4
%ÿÿÿÿ
```

After that we add the objects which will lay out the document. Each object begins with an id followed by a dictionary and an optional stream. We won’t be working with streams this round.

```
1 0 obj
<<
  /Type /Catalog
  /Pages 2 0 R
>>
endobj
```

Following the objects we put down the `xref`. The `xref` is an index of the objects in the file to help readers locate them quickly (and add a bit more info in PDF files that have been modified).

```
xref
0 3
0000000000 65535 f
0000000222 00000 n
0000000031 00000 n
```

Each object in the file needs to have a record in the `xref` which points to the object’s location in bytes from the start of the file so as we write out objects we need to keep track of where they are being written. To do this we will keep a tally of the lengths  of data we write and record it’s value before writing each object.

To finish off we need to add a Trailer and a pointer to the start of the `xref`.

```
trailer
<< /Size 7 /Root 6 0 R
/ID [<abc123><abc123>]
>>
startxref
521
%%EOF
```

The example code below is Javascript (ES6) but would be easily translated to others.

Let’s create the file and write the header..

```
let fileOffset = 0;
const pdf = fs.createWriteStream(`hello-world.pdf`);

const head = new Buffer(`%PDF-1.4\n%\xFF\xFF\xFF\xFF\n`, 'binary');

// update fileOffset to point to the next object's position
fileOffset += head.length;
pdf.write(head);
```

And our first (and only) object; we’ll add the catalog..

*(the funky formatting is to ensure the correct newlines without a bunch of \n)*

```
let cat = `1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
`;

// record the position the catalog will be written at
let offsets = { 1: fileOffset };

cat = new Buffer(cat, 'binary');
fileOffset += cat.length;
pdf.write(cat);
```

Once we’ve added our objects to the file we can add our `xref` (we don’t have nearly enough for a valid PDF yet, we’ll add those next time).

For a new PDF each object in our file needs a line in the `xref` consisting of it’s location in bytes from the start of the file followed by `" 0000 n”` which relates to the version of the object and it's active state and only needs to change if an existing PDF is being modified.

The lines in the `xref` must be sorted by object id and the ids must be sequential.

We also need to record the file offset of the `xref` for the PDF footer.

```
const xrefOffset = fileOffset;
const fontOffset = `0000000000${offsets['1']}`.slice(-10);
const count = Object.keys(offsets).length;

const xref = `xref
0 ${count}
0000000000 65535 f
${fontOffset} 00000 n
`;

pdf.write(xref);
```

After the `xref` comes the `trailer` containing a dictionary telling the reader how many `xref` entries there are, the root object’s id, and the document’s id amongst other things.

```
pdf.write(`trailer
<<
  /Size 7
  /Root 1 0 R
  /ID [<abc123>, <abc123>]
>>
`);
```

Then we finish it off with a pointer to the start of the xref where the reader knows where to find it near the end of the file.

```
pdf.write(`startxref
${xrefOffset}
%%EOF
`);
```

The file that is created is valid PDF markup, but is incomplete so won’t open in a PDF viewer. We’ll need to add some more objects such as Pages, Page,   Font, ProcSet, Resource, and Content, but that’s probably enough for today.
