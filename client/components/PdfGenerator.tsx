import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

// Interface para as props que serão recebidas do OrderFlow
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

interface PdfGeneratorProps {
  orderData: OrderData;
  onClose: () => void;
}

export default function PdfGenerator({ orderData, onClose }: PdfGeneratorProps) {
  const [fileName, setFileName] = useState(`pedido_${orderData.nomeEmpresa}_${orderData.data.replace(/\//g, '-')}`.replace(/\s+/g, '_'));
  const [isGenerating, setIsGenerating] = useState(false);

  // Calcular total dos produtos
  const calculateTotal = () => {
    return orderData.produtos.reduce((total, produto) => {
      return total + (produto.quantidade * produto.preco);
    }, 0);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  // Gerar HTML para o PDF
  const generateHtmlContent = () => {
    const total = calculateTotal();
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            margin: 40px;
            color: #333;
          }
          .header {
            text-align: center;
            margin-bottom: 40px;
            border-bottom: 2px solid #007AFF;
            padding-bottom: 20px;
          }
          .title {
            font-size: 28px;
            color: #007AFF;
            margin: 0;
          }
          .subtitle {
            font-size: 16px;
            color: #666;
            margin: 5px 0;
          }
          .section {
            margin-bottom: 30px;
          }
          .section-title {
            font-size: 18px;
            color: #007AFF;
            border-bottom: 1px solid #eee;
            padding-bottom: 8px;
            margin-bottom: 15px;
          }
          .info-grid {
            display: grid;
            grid-template-columns: 150px 1fr;
            gap: 10px;
            margin-bottom: 10px;
          }
          .info-label {
            font-weight: bold;
            color: #555;
          }
          .info-value {
            color: #333;
          }
          .products-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
          }
          .products-table th {
            background-color: #007AFF;
            color: white;
            text-align: left;
            padding: 12px;
            font-weight: bold;
          }
          .products-table td {
            padding: 12px;
            border-bottom: 1px solid #eee;
          }
          .products-table tr:nth-child(even) {
            background-color: #f9f9f9;
          }
          .text-right {
            text-align: right;
          }
          .text-center {
            text-align: center;
          }
          .total-section {
            margin-top: 30px;
            text-align: right;
            border-top: 2px solid #007AFF;
            padding-top: 20px;
          }
          .total-label {
            font-size: 20px;
            font-weight: bold;
            color: #333;
          }
          .total-value {
            font-size: 24px;
            font-weight: bold;
            color: #007AFF;
            margin-top: 5px;
          }
          .footer {
            margin-top: 50px;
            text-align: center;
            color: #888;
            font-size: 12px;
            border-top: 1px solid #eee;
            padding-top: 20px;
          }
          .observacoes {
            background-color: #f5f5f5;
            padding: 15px;
            border-radius: 5px;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1 class="title">PEDIDO</h1>
          <div class="subtitle">Gerado em: ${new Date().toLocaleDateString('pt-BR')}</div>
        </div>
        
        <div class="section">
          <h2 class="section-title">Informações do Pedido</h2>
          <div class="info-grid">
            <div class="info-label">Cliente:</div>
            <div class="info-value">${orderData.nomeEmpresa || 'Não informado'}</div>
            
            <div class="info-label">Data:</div>
            <div class="info-value">${orderData.data || 'Não informada'}</div>
            
            <div class="info-label">Condição de Pagamento:</div>
            <div class="info-value">${orderData.condicaoPagamento || 'Não informada'}</div>
          </div>
        </div>
        
        <div class="section">
          <h2 class="section-title">Produtos</h2>
          <table class="products-table">
            <thead>
              <tr>
                <th>Produto</th>
                <th>Quantidade</th>
                <th>Preço Unitário</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${orderData.produtos.map(produto => `
                <tr>
                  <td>${produto.nome}</td>
                  <td class="text-center">${produto.quantidade}</td>
                  <td class="text-right">${formatCurrency(produto.preco)}</td>
                  <td class="text-right">${formatCurrency(produto.quantidade * produto.preco)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        
        <div class="total-section">
          <div class="total-label">TOTAL DO PEDIDO:</div>
          <div class="total-value">${formatCurrency(total)}</div>
        </div>
        
        ${orderData.observacoes ? `
          <div class="section">
            <h2 class="section-title">Observações</h2>
            <div class="observacoes">
              ${orderData.observacoes}
            </div>
          </div>
        ` : ''}
        
        <div class="footer">
          Documento gerado automaticamente pelo sistema de pedidos
        </div>
      </body>
      </html>
    `;
  };

  // Gerar e compartilhar PDF
  const handleGeneratePDF = async () => {
    if (!fileName.trim()) {
      Alert.alert('Atenção', 'Por favor, informe um nome para o arquivo PDF');
      return;
    }

    if (fileName.length > 100) {
      Alert.alert('Atenção', 'O nome do arquivo é muito longo. Use no máximo 100 caracteres.');
      return;
    }

    setIsGenerating(true);

    try {
      // Gerar o HTML para o PDF
      const html = generateHtmlContent();
      
      // Gerar o PDF
      const { uri } = await Print.printToFileAsync({
        html: html,
        base64: false,
      });

      console.log('PDF gerado em:', uri);

      // Renomear o arquivo se possível
      const finalFileName = `${fileName}.pdf`;
      
      // Verificar se é possível compartilhar
      const isSharingAvailable = await Sharing.isAvailableAsync();
      
      if (isSharingAvailable) {
        // Compartilhar o PDF
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Salvar ou Compartilhar Pedido',
          UTI: 'com.adobe.pdf',
        });
        
        Alert.alert(
          'Sucesso!',
          `PDF "${finalFileName}" gerado e pronto para compartilhar!`,
          [{ text: 'OK', onPress: onClose }]
        );
      } else {
        // Se não puder compartilhar, apenas mostrar sucesso
        Alert.alert(
          'PDF Gerado!',
          `Arquivo salvo como: ${finalFileName}`,
          [{ text: 'OK', onPress: onClose }]
        );
      }
      
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      Alert.alert(
        'Erro',
        'Não foi possível gerar o PDF. Tente novamente.'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header do Modal */}
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>Gerar PDF do Pedido</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Resumo do Pedido */}
        <View style={styles.summaryContainer}>
          <Text style={styles.sectionTitle}>Resumo do Pedido</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Cliente:</Text>
            <Text style={styles.infoValue}>{orderData.nomeEmpresa || 'Não informado'}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Data:</Text>
            <Text style={styles.infoValue}>{orderData.data || 'Não informada'}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Pagamento:</Text>
            <Text style={styles.infoValue}>{orderData.condicaoPagamento || 'Não informada'}</Text>
          </View>
          
          {orderData.observacoes && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Observações:</Text>
              <Text style={styles.infoValue}>{orderData.observacoes}</Text>
            </View>
          )}
        </View>

        {/* Produtos */}
        <View style={styles.productsContainer}>
          <Text style={styles.sectionTitle}>Produtos ({orderData.produtos.length})</Text>
          
          {orderData.produtos.length > 0 ? (
            orderData.produtos.map((produto, index) => (
              <View key={produto.id || index} style={styles.productItem}>
                <View style={styles.productHeader}>
                  <Text style={styles.productName}>{produto.nome}</Text>
                  <Text style={styles.productPrice}>{formatCurrency(produto.preco)}</Text>
                </View>
                <View style={styles.productDetails}>
                  <Text style={styles.productQuantity}>Quantidade: {produto.quantidade}</Text>
                  <Text style={styles.productSubtotal}>
                    Subtotal: {formatCurrency(produto.quantidade * produto.preco)}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.noProductsText}>Nenhum produto adicionado</Text>
          )}
          
          {/* Total */}
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>TOTAL:</Text>
            <Text style={styles.totalValue}>{formatCurrency(calculateTotal())}</Text>
          </View>
        </View>

        {/* Nome do arquivo PDF */}
        <View style={styles.fileNameContainer}>
          <Text style={styles.sectionTitle}>Nome do Arquivo PDF</Text>
          <TextInput
            style={styles.input}
            value={fileName}
            onChangeText={setFileName}
            placeholder="Digite o nome do arquivo"
            placeholderTextColor="#8E8E93"
            maxLength={100}
            editable={!isGenerating}
          />
          <Text style={styles.fileExtension}>.pdf</Text>
          <Text style={styles.inputHint}>
            O arquivo será salvo como: {fileName}.pdf
          </Text>
        </View>

        {/* Botões */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[styles.button, styles.generateButton, isGenerating && styles.disabledButton]}
            onPress={handleGeneratePDF}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color="white" size="small" />
                <Text style={[styles.buttonText, styles.loadingText]}>Gerando...</Text>
              </View>
            ) : (
              <Text style={styles.buttonText}>Gerar e Compartilhar PDF</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={onClose}
            disabled={isGenerating}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>

        {/* Informações sobre o PDF */}
        <View style={styles.infoBox}>
          <Text style={styles.infoBoxTitle}>Como funciona:</Text>
          <Text style={styles.infoBoxText}>
            1. O PDF será gerado com todas as informações do pedido{'\n'}
            2. Você poderá escolher onde salvar o arquivo{'\n'}
            3. Também é possível compartilhar por WhatsApp, e-mail, etc.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#8E8E93',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  summaryContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productsContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  fileNameContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
    paddingBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 16,
    color: '#8E8E93',
    flex: 1,
  },
  infoValue: {
    fontSize: 16,
    color: '#1C1C1E',
    fontWeight: '500',
    flex: 2,
    textAlign: 'right',
  },
  productItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
    paddingVertical: 12,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1C1C1E',
    flex: 2,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    flex: 1,
    textAlign: 'right',
  },
  productDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  productQuantity: {
    fontSize: 14,
    color: '#8E8E93',
  },
  productSubtotal: {
    fontSize: 14,
    color: '#34C759',
    fontWeight: '600',
  },
  noProductsText: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    fontStyle: 'italic',
    paddingVertical: 20,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 2,
    borderTopColor: '#007AFF',
  },
  totalLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  totalValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: '#1C1C1E',
    backgroundColor: '#F9F9F9',
    marginBottom: 5,
  },
  fileExtension: {
    fontSize: 16,
    color: '#8E8E93',
    marginLeft: 15,
    marginBottom: 10,
  },
  inputHint: {
    fontSize: 14,
    color: '#8E8E93',
    fontStyle: 'italic',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  generateButton: {
    backgroundColor: '#007AFF',
    flex: 1.5,
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#8E8E93',
    flex: 0.8,
  },
  disabledButton: {
    backgroundColor: '#C7C7CC',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8E8E93',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginLeft: 10,
  },
  infoBox: {
    backgroundColor: '#E8F4FF',
    borderRadius: 10,
    padding: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  infoBoxTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 8,
  },
  infoBoxText: {
    fontSize: 14,
    color: '#5A5A5A',
    lineHeight: 20,
  },
});