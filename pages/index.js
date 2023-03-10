import { useState } from 'react';
import styled from 'styled-components';
import { PDFDocument, StandardFonts } from 'pdf-lib';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 0.25rem;
`;

const Label = styled.label`
  display: flex;
  flex-direction: column;
  margin-bottom: 0.5rem;
  width: 100%;
`;

const Input = styled.input`
  padding: 0.5rem;
  border-radius: 0.25rem;
  border: 1px solid #ccc;
  width: 100%;
`;

const Error = styled.span`
  color: red;
`;

const SubmitButton = styled.input`
  background-color: #0070f3;
  color: #fff;
  border: none;
  border-radius: 0.25rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease-out;

  &:hover {
    background-color: #0061d6;
  }
`;

export default function Home() {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validation logic here
    // If there are errors, setErrors with an object of error messages
    // Otherwise, submit the form data
    if (Object.keys(errors).length > 0) {
        return;
  };

  const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSize = 16;
    const lineHeight = fontSize * 1.2;
    const marginBottom = 20;

    const drawText = (text, x, y) => {
      const textWidth = font.widthOfTextAtSize(text, fontSize);
      page.drawText(text, {
        x: x + textWidth / 2,
        y,
        size: fontSize,
        font,
      });
    };

    const textX = 50;
    let textY = page.getSize().height - marginBottom;

    drawText(`Name: ${formData.name}`, textX, textY);
    textY -= lineHeight;

    drawText(`Race: ${formData.race}`, textX, textY);
    textY -= lineHeight;

    drawText(`Class: ${formData.class}`, textX, textY);
    textY -= lineHeight;

    drawText(`Level: ${formData.level}`, textX, textY);
    textY -= lineHeight;

    drawText(`Alignment: ${formData.alignment}`, textX, textY);
    textY -= lineHeight;

    const pdfBytes = await pdfDoc.save();

    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'character-sheet.pdf';
    link.click();
    URL.revokeObjectURL(url);
  };
  



  //
  return (
    <Form onSubmit={handleSubmit}>
      <Label>
        Name:
        <Input name="name" type="text" value={formData.name || ''} onChange={handleChange} />
        {errors.name && <Error>{errors.name}</Error>}
      </Label>
      <Label>
        Race:
        <Input name="race" type="text" value={formData.race || ''} onChange={handleChange} />
        {errors.race && <Error>{errors.race}</Error>}
      </Label>
      <Label>
        Class:
        <Input name="class" type="text" value={formData.class || ''} onChange={handleChange} />
        {errors.class && <Error>{errors.class}</Error>}
      </Label>
      <Label>
        Level:
        <Input name="level" type="number" value={formData.level || ''} onChange={handleChange} />
        {errors.level && <Error>{errors.level}</Error>}
      </Label>
      <Label>
        Alignment:
        <Input name="alignment" type="text" value={formData.alignment || ''} onChange={handleChange} />
        {errors.alignment && <Error>{errors.alignment}</Error>}
      </Label>
      <SubmitButton type="submit" value="Submit" />
    </Form>
  )};
  