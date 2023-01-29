import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button,StatusBar } from 'react-native';
import QrCodeMask from 'react-native-qrcode-mask';
import { BarCodeScanner } from 'expo-barcode-scanner';

export default function QeCodeReader() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    alert(`Bar code with type ${type} and data ${data} has been scanned!`);
  };

  if (hasPermission === null) {
    return <Text>Yame precisa de acesso câmera para ler o  código</Text>;
  }
  if (hasPermission === false) {
    return <Text>Não existe acesso a câmera</Text>;
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.background} barStyle={theme.dark ? 'default' : 'dark-content'} />
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      >
      </BarCodeScanner>
      <QrCodeMask
        // lineColor='green'
        //lineDirection='horizontal'
        height={150}
        width={150}
        edgeColor='red'
        topTitle='Leitor de Código QR'
        bottomTitle='Centre o codigo dentro de quadrado'
      />
      {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    marginVertical:20
  },
});
