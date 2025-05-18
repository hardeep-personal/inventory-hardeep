// components/PrescriptionPDF.jsx
import React from 'react';
import { Page, Text, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    paddingTop: 100,
    paddingLeft: 30,
    fontSize: 14,
    fontFamily: 'Helvetica',
    whiteSpace: 'pre-line'
  },
  heading: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  content: {
    marginTop: 20, // <-- Adds space between heading and text
    lineHeight: 1.5, // Optional: improves readability
    whiteSpace: 'pre-line',
  },
});

const PrescriptionPDF = ({ text }) => (
  <Document>
    <Page style={styles.page}>
      <Text style={styles.heading}>Prescription</Text>
      <Text style={styles.content}>{text}</Text>
    </Page>
  </Document>
);

export default PrescriptionPDF;
