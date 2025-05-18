import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Define styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    fontFamily: 'Helvetica',
    lineHeight: 1.5,
  },
  heading: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 14,
    marginBottom: 10,
    fontWeight: 'bold',
    textDecoration: 'underline',
  },
  patientInfo: {
    marginBottom: 20,
  },
  label: {
    fontWeight: 'bold',
  },
  textBlock: {
    marginTop: 10,
    whiteSpace: 'pre-wrap',
    textAlign: 'justify',
  },
});

// Improved PDF Component
const ReportPDF = ({ patient, text }) => (
  <Document>
    <Page style={styles.page}>
      <Text style={styles.heading}>Medical Report</Text>

      {/* <View style={styles.patientInfo}>
        <Text style={styles.sectionTitle}>Patient Information</Text>
        <Text>
          <Text style={styles.label}>Name:</Text> {patient}
        </Text>
      </View> */}

      <View>
        <Text style={styles.sectionTitle}>Report Details</Text>
        <Text style={styles.textBlock}>{text}</Text>
      </View>
    </Page>
  </Document>
);

export default ReportPDF;
