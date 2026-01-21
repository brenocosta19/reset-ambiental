import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { FONTS } from '@/assets/fonts/fonts';

export default function Index() {
  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.greeting}>
          <Text style={styles.greetingText}>Olá,</Text>
          <Text style={styles.greetingText}>Celso Marques</Text>
        </View>
        <Ionicons name="notifications-outline" size={24} color="black" style={styles.notificationIcon} />
      </View>

      {/* Main Content Section */}
        <View style={styles.content}>
        <Image 
          source={require('../../assets/images/fast-package-3.png')}
          style={styles.image}
        />
        <Text style={styles.title}>Central</Text>
        <Text style={styles.title}>Reset Ambiental</Text>
        <Text style={styles.description}>
          Crie pedidos em PDF e mantenha o controle financeiro da empresa.
        </Text>
        <Pressable style={styles.button}>
          <Ionicons name="add" size={18} color="#fff" />
          <Text style={styles.buttonText}>Começar</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E6E6E6",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 40,
    paddingHorizontal: 20,
  },
  greeting: {
    flexDirection: "column",
  },
  greetingText: {
    fontSize: 17,
    fontFamily: FONTS.bold,
    color: "#333", // Adicionado para melhor contraste
  },
  notificationIcon: {
    marginRight: 0, // Ajustado para alinhamento
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 220,
  },
  image: {
    width: 240,
    height: 240,
    marginBottom: 20,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: 24,
    color: "#333",
    textAlign: "center",
  },
  description: {
    fontFamily: FONTS.regular,
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 20,
    lineHeight: 22, // Melhor legibilidade
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000',
    paddingHorizontal: 40,
    height: 50,
    borderRadius: 25, // Mais arredondado para modernidade
    marginTop: 20,
    shadowColor: '#000', // Adicionada sombra para profundidade
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // Para Android
  },
  buttonText: {
    color: '#fff',
    marginLeft: 6,
    fontSize: 14,
    fontFamily: FONTS.bold, // Adicionado negrito para ênfase
  },
});