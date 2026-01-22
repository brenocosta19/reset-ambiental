import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { FONTS } from '@/assets/fonts/fonts';

interface OrderData {
  nomeEmpresa: string;
  data: string;
  condicaoPagamento: string;
  produtos: Array<{
    id: string;
    nome: string;
    quantidade: number;
    preco: number;
  }>;
  observacoes?: string;
}

interface ClientStepProps {
  orderData: OrderData;
  updateCliente: (clienteData: Partial<Omit<OrderData, 'produtos'>>) => void;
}

export default function ClientStep({ orderData, updateCliente }: ClientStepProps) {
  const currentStep = 1;
  const totalSteps = 3;

  const handleChange = (field: keyof Omit<OrderData, 'produtos'>, value: string) => {
    updateCliente({ [field]: value });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.select({ ios: 100, android: 0 })}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        style={styles.container}
      >
        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          {Array.from({ length: totalSteps }, (_, index) => (
            <View
              key={index}
              style={[
                styles.progressStep,
                index < currentStep ? styles.progressStepActive : styles.progressStepInactive,
              ]}
            />
          ))}
        </View>
        <Text style={styles.progressText}>Passo {currentStep} de {totalSteps}</Text>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Informações do Pedido</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Text style={styles.label}>Nome da Empresa</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="business" size={20} color="#999" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Digite o nome da empresa"
              placeholderTextColor="#999"
              value={orderData.nomeEmpresa}
              onChangeText={(text) => handleChange('nomeEmpresa', text)}
            />
          </View>

          <Text style={styles.label}>Data</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="calendar" size={20} color="#999" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="DD/MM/AAAA"
              placeholderTextColor="#999"
              keyboardType="numeric"
              value={orderData.data}
              onChangeText={(text) => handleChange('data', text)}
            />
          </View>

          <Text style={styles.label}>Condição de Pagamento</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="card" size={20} color="#999" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Ex: À vista, 30 dias"
              placeholderTextColor="#999"
              value={orderData.condicaoPagamento}
              onChangeText={(text) => handleChange('condicaoPagamento', text)}
            />
          </View>

          <Text style={styles.label}>Observações</Text>
          <View style={[styles.inputContainer, styles.observationsContainer]}>
            <Ionicons name="document-text" size={20} color="#999" style={[styles.inputIcon, styles.observationsIcon]} />
            <TextInput
              style={[styles.input, styles.observationsInput]}
              placeholder="Observações adicionais (opcional)"
              placeholderTextColor="#999"
              multiline
              textAlignVertical="top"
              value={orderData.observacoes || ''}
              onChangeText={(text) => handleChange('observacoes', text)}
              returnKeyType="done"
              blurOnSubmit={true}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E6E6E6',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40, // Espaço extra para o teclado
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
  },
  progressStep: {
    width: 40,
    height: 4,
    borderRadius: 2,
    marginHorizontal: 4,
  },
  progressStepActive: {
    backgroundColor: '#000000',
  },
  progressStepInactive: {
    backgroundColor: '#DDD',
  },
  progressText: {
    textAlign: 'center',
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: '#666',
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  form: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    marginBottom: 8,
    marginTop: 20,
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  observationsContainer: {
    alignItems: 'flex-start',
    minHeight: 120,
  },
  inputIcon: {
    marginLeft: 12,
  },
  observationsIcon: {
    marginTop: 14,
  },
  input: {
    flex: 1,
    height: 48,
    paddingHorizontal: 12,
    fontSize: 16,
    fontFamily: FONTS.regular,
  },
  observationsInput: {
    height: 'auto',
    minHeight: 100,
    paddingTop: 14,
    paddingBottom: 14,
  },
});