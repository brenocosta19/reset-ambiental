import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Modal,
} from 'react-native';
import ClientStep from "./ClientStep";
import ProductStep from "./ProductStep";
import SummaryStep from "./SummaryStep";
import PdfGenerator from "../PdfGenerator";
import { FONTS } from '@/assets/fonts/fonts';

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

  // Função para atualizar os dados básicos
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

      {/* Conteúdo do step (SEM container extra) */}
      {renderStepContent()}

      {/* Botões */}
      <View style={styles.buttonsContainer}>
        {/* Botão Anterior */}
        {step > 1 && (
          <TouchableOpacity
            style={[styles.button, styles.grayButton]}
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
            style={[styles.button, styles.grayButton]}
            onPress={handleNext}
          >
            <Text style={styles.buttonText}>
              Continuar
            </Text>
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity
              style={[styles.button, styles.grayButton]}
              onPress={handleFinishOrder}
            >
              <Text style={styles.buttonText}>
                Finalizar
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, styles.grayButton]}
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
    backgroundColor: '#E6E6E6',
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: '#F2F2F7',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 24,
    textAlign: 'center',
  },
  stepIndicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  stepIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepIndicator: {
    width: 36,
    height: 36,
    borderRadius: 18,
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
    marginHorizontal: 4,
  },
  stepCounter: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: 8,
  },
  stepContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#E6E6E6',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  button: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    flexGrow: 1,
    marginBottom: 10,
    
  },
  grayButton: {
    backgroundColor: '#8E8E93',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#8E8E93',
    flexBasis: '100%',
    marginTop: 8,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '600',
    color: 'white',
    fontFamily: FONTS.regular
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#8E8E93',
  },
});