import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  Modal,
} from 'react-native';
import ClientStep from "./ClientStep";
import ProductStep from "./ProductStep";
import SummaryStep from "./SummaryStep";
import PdfGenerator from "../PdfGenerator";

// Tipos
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

export default function OrderFlow() {
  const [step, setStep] = useState(1);
  const totalSteps = 3;
  const [showPdfModal, setShowPdfModal] = useState(false);

  // Estado único para todos os dados do pedido
  const [orderData, setOrderData] = useState<OrderData>({
    nomeEmpresa: '',
    data: '',
    condicaoPagamento: '',
    produtos: [],
    observacoes: '',
  });

  // Função para atualizar os dados básicos - RENOMEADA para updateCliente
  const updateCliente = (orderInfo: Partial<Omit<OrderData, 'produtos'>>) => {
    setOrderData(prev => ({
      ...prev,
      ...orderInfo
    }));
  };

  const updateProdutos = (produtos: OrderData['produtos']) => {
    setOrderData(prev => ({
      ...prev,
      produtos
    }));
  };

  // Navegação com validação
  const handleNext = () => {
    // Validações antes de avançar
    if (step === 1) {
      if (!orderData.nomeEmpresa.trim()) {
        Alert.alert('Atenção', 'Informe o nome da empresa');
        return;
      }
      if (!orderData.data.trim()) {
        Alert.alert('Atenção', 'Informe a data');
        return;
      }
      if (!orderData.condicaoPagamento.trim()) {
        Alert.alert('Atenção', 'Informe a condição de pagamento');
        return;
      }
    }

    if (step === 2 && orderData.produtos.length === 0) {
      Alert.alert('Atenção', 'Adicione pelo menos um produto');
      return;
    }

    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // Finalizar pedido
  const handleFinishOrder = () => {
    Alert.alert(
      'Pedido Salvo!',
      'Pedido salvo localmente com sucesso!',
      [
        {
          text: 'OK',
          onPress: () => {
            resetOrder();
          },
        },
      ]
    );
    
    console.log('Pedido salvo:', orderData);
  };

  // Gerar PDF
  const handleGeneratePDF = () => {
    setShowPdfModal(true);
  };

  // Resetar pedido
  const resetOrder = () => {
    setOrderData({
      nomeEmpresa: '',
      data: '',
      condicaoPagamento: '',
      produtos: [],
      observacoes: '',
    });
    setStep(1);
    setShowPdfModal(false);
  };

  const renderStepContent = () => {
    // Props que serão passadas para os steps
    switch (step) {
      case 1:
        return <ClientStep 
          orderData={orderData} 
          updateCliente={updateCliente} 
        />;
      case 2:
        return <ProductStep 
          orderData={orderData} 
          updateProdutos={updateProdutos} 
        />;
      case 3:
        return <SummaryStep 
          orderData={orderData} 
          onConfirm={handleFinishOrder} 
        />;
      default:
        return (
          <View style={styles.stepContent}>
            <Text>Step não encontrado</Text>
          </View>
        );
    }
  };

  const renderStepIndicator = () => {
    return (
      <View style={styles.stepIndicatorContainer}>
        {[...Array(totalSteps)].map((_, index) => (
          <View key={index} style={styles.stepIndicatorRow}>
            <View
              style={[
                styles.stepIndicator,
                {
                  backgroundColor:
                    index + 1 <= step ? '#007AFF' : '#E5E5EA',
                },
              ]}
            >
              <Text
                style={[
                  styles.stepIndicatorText,
                  {
                    color: index + 1 <= step ? 'white' : '#8E8E93',
                  },
                ]}
              >
                {index + 1}
              </Text>
            </View>
            {index < totalSteps - 1 && (
              <View
                style={[
                  styles.stepLine,
                  {
                    backgroundColor: index + 1 < step ? '#007AFF' : '#E5E5EA',
                  },
                ]}
              />
            )}
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.header}>Criar Pedido</Text>
        
        {/* Indicador de progresso */}
        {renderStepIndicator()}
        
        <Text style={styles.stepCounter}>
          Passo {step} de {totalSteps}
        </Text>

        {/* Conteúdo do step */}
        <View style={styles.contentContainer}>
          {renderStepContent()}
        </View>

        {/* Botões */}
        <View style={styles.buttonsContainer}>
          {/* Botão Anterior */}
          {step > 1 && (
            <TouchableOpacity
              style={[styles.button, styles.previousButton]}
              onPress={handlePrevious}
            >
              <Text style={styles.buttonText}>
                Voltar
              </Text>
            </TouchableOpacity>
          )}

          {/* Botão Principal */}
          {step < totalSteps ? (
            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={handleNext}
            >
              <Text style={styles.buttonText}>
                Continuar
              </Text>
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity
                style={[styles.button, styles.successButton]}
                onPress={handleFinishOrder}
              >
                <Text style={styles.buttonText}>
                  Finalizar Pedido
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.button, styles.pdfButton]}
                onPress={handleGeneratePDF}
              >
                <Text style={styles.buttonText}>
                  Gerar PDF
                </Text>
              </TouchableOpacity>
            </>
          )}

          {/* Botão Cancelar */}
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={() => {
              Alert.alert(
                'Cancelar Pedido',
                'Tem certeza que deseja cancelar? Todos os dados serão perdidos.',
                [
                  { text: 'Continuar Editando', style: 'cancel' },
                  { 
                    text: 'Cancelar Pedido', 
                    style: 'destructive',
                    onPress: resetOrder
                  },
                ]
              );
            }}
          >
            <Text style={styles.cancelButtonText}>
              Cancelar
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal para gerar PDF */}
      <Modal
        visible={showPdfModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowPdfModal(false)}
      >
        <PdfGenerator
          orderData={orderData}
          onClose={() => setShowPdfModal(false)}
        />
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 30,
    textAlign: 'center',
  },
  stepIndicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  stepIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepIndicator: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepIndicatorText: {
    fontSize: 16,
    fontWeight: '600',
  },
  stepLine: {
    width: 40,
    height: 2,
    marginHorizontal: 5,
  },
  stepCounter: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 30,
  },
  contentContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  stepContent: {
    alignItems: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 'auto',
    marginBottom: 20,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
    flexGrow: 1,
  },
  previousButton: {
    backgroundColor: '#8E8E93',
    flexBasis: '30%',
  },
  primaryButton: {
    backgroundColor: '#007AFF',
    flexBasis: '65%',
  },
  successButton: {
    backgroundColor: '#34C759',
    flexBasis: '48%',
  },
  pdfButton: {
    backgroundColor: '#FF9500',
    flexBasis: '48%',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#FF3B30',
    flexBasis: '100%',
    marginTop: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF3B30',
  },
});