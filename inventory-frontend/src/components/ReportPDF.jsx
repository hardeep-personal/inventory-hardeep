import { Document, Page, Text, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 40 },
  heading: { fontSize: 20, marginBottom: 10 },
  text: { marginTop: 20, whiteSpace: 'pre-line' }
});

const ReportPDF = ({ patient, text }) => (
  <Document>
    <Page style={styles.page}>
      <Text style={styles.heading}>Medical Report</Text>
      <Text>Patient: {patient}</Text>
      <Text style={styles.text}>{text}</Text>
    </Page>
  </Document>
);

export default ReportPDF;
