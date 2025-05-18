import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    marginBottom: 20,
    fontSize: 12,
    fontFamily: 'Helvetica',
    lineHeight: 1.5,
  },
  heading: {
    fontSize: 22,
    marginBottom: 30,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#333',
  },
  infoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    gap: 20,
  },
  infoBlock: {
    flex: 1,
  },
  labelText: {
    fontWeight: 'bold',
    color: '#111',
  },
  table: {
    borderWidth: 1,
    borderColor: '#000',
    marginTop: 10,
    borderRadius: 4,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderBottomWidth: 1,
    borderColor: '#000',
    padding: 6,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    padding: 6,
  },
  colHeader: {
    flex: 1,
    fontWeight: 'bold',
    color: '#000',
  },
  col: {
    flex: 1,
  },
  total: {
    textAlign: 'right',
    marginTop: 12,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#222',
  },
  footer: {
    marginTop: 30,
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#555',
  },
});

const ReceiptPDF = ({ patientData, amount = 500 }) => {
  const {
    owner_name,
    phone,
    animal_name,
    species,
    breed,
    age,
    gender,
    color,
    weight,
    visit_date,
    symptoms,
  } = patientData || {};

  return (
    <Document>
      <Page style={styles.page}>
        <Text style={styles.heading}>Animal Clinic Receipt</Text>

        <View style={styles.infoGrid}>
          <View style={styles.infoBlock}>
            <Text><Text style={styles.labelText}>Owner:</Text> {owner_name}</Text>
            <Text><Text style={styles.labelText}>Phone:</Text> {phone}</Text>
            <Text><Text style={styles.labelText}>Visit Date:</Text> {visit_date}</Text>
            <Text><Text style={styles.labelText}>Animal:</Text> {animal_name}</Text>
            <Text><Text style={styles.labelText}>Species:</Text> {species}</Text>
          </View>
     
          <View style={styles.infoBlock}>
            <Text><Text style={styles.labelText}>Breed:</Text> {breed}</Text>
            <Text><Text style={styles.labelText}>Age:</Text> {age}</Text>
            <Text><Text style={styles.labelText}>Gender:</Text> {gender}</Text>
           
            <Text><Text style={styles.labelText}>Color:</Text> {color}</Text>
            <Text><Text style={styles.labelText}>Weight:</Text> {weight} kg</Text>
          </View>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.colHeader}>Service</Text>
            <Text style={styles.colHeader}>Details</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.col}>Symptoms / Reason</Text>
            <Text style={styles.col}>{symptoms || '—'}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.col}>Consultation Fee</Text>
            <Text style={styles.col}>Rs {amount}</Text>
            </View>
        </View>

        <Text style={styles.total}>Total Paid: Rs {amount}</Text>
        <Text style={styles.total}>Payment Status: ✅ Paid</Text>

        <Text style={styles.footer}>Thank you for visiting our animal clinic!</Text>
      </Page>
    </Document>
  );
};

export default ReceiptPDF;