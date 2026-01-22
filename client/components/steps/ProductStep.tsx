import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  Alert
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { FONTS } from '@/assets/fonts/fonts';

// Tipos
interface Produto {
  id: string;
  nome: string;
  quantidade: number;
  preco: number;
}

interface OrderData {
  nomeEmpresa: string;
  data: string;
  condicaoPagamento: string;
  produtos: Produto[];
  observacoes?: string;
}

interface ProductStepProps {
  orderData: OrderData;
  updateProdutos: (produtos: Produto[]) => void;
}

export default function ProductStep({ orderData, updateProdutos }: ProductStepProps) {
  // Estados para o formulário de novo produto
  const [productName, setProductName] = useState('');
  const [unitPrice, setUnitPrice] = useState('');
  const [qty, setQty] = useState('1');

  // Calcular total
  const calculateTotal = () => {
    return orderData.produtos.reduce((total, produto) => 
      total + (produto.quantidade * produto.preco), 0
    );
  };

  // Função para adicionar produto
  const addProduct = () => {
    if (!productName.trim()) {
      Alert.alert('Erro', 'Informe o nome do produto!');
      return;
    }
    
    if (!unitPrice.trim()) {
      Alert.alert('Erro', 'Informe o preço unitário!');
      return;
    }

    const price = parseFloat(unitPrice.replace(',', '.'));
    const quantity = parseInt(qty) || 1;
    
    if (isNaN(price) || price <= 0) {
      Alert.alert('Erro', 'Preço inválido!');
      return;
    }
    
    if (quantity <= 0) {
      Alert.alert('Erro', 'Quantidade inválida!');
      return;
    }

    const newProduct: Produto = {
      id: Date.now().toString(),
      nome: productName,
      quantidade: quantity,
      preco: price,
    };

    // Atualizar a lista de produtos via props
    updateProdutos([...orderData.produtos, newProduct]);
    
    // Limpar campos
    setProductName('');
    setUnitPrice('');
    setQty('1');
  };

  // Função para aumentar quantidade
  const increaseQty = (id: string) => {
    const updatedProdutos = orderData.produtos.map(item => 
      item.id === id ? { ...item, quantidade: item.quantidade + 1 } : item
    );
    updateProdutos(updatedProdutos);
  };

  // Função para diminuir quantidade
  const decreaseQty = (id: string) => {
    const updatedProdutos = orderData.produtos.map(item => 
      item.id === id && item.quantidade > 1 ? { ...item, quantidade: item.quantidade - 1 } : item
    );
    updateProdutos(updatedProdutos);
  };

  // Função para remover produto
  const removeProduct = (id: string) => {
    const filteredProdutos = orderData.produtos.filter(item => item.id !== id);
    updateProdutos(filteredProdutos);
  };

  // Progress indicator (estático para step 2)
  const currentStep = 2;
  const totalSteps = 3;

  return (
    <ScrollView>
      <View style={styles.container}>
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
          <Text style={styles.title}>Produtos do Pedido</Text>
        </View>
  
        {/* Formulário para adicionar produto */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Feather name="box" size={20} color="#000" />
            <Text style={styles.cardTitle}>Adicionar Produto</Text>
          </View>
  
          <Text style={styles.label}>Nome do Produto</Text>
          <TextInput 
            style={styles.input} 
            value={productName}
            onChangeText={setProductName}
            placeholder="Ex: Produto A"
            placeholderTextColor="#999"
          />
  
          <View style={styles.row}>
            <View style={[styles.column, { flex: 2, marginRight: 12 }]}>
              <Text style={styles.label}>Preço Unitário (R$)</Text>
              <TextInput 
                style={styles.input} 
                value={unitPrice}
                onChangeText={setUnitPrice}
                keyboardType="numeric" 
                placeholder="0.00"
                placeholderTextColor="#999"
              />
            </View>
            
            <View style={[styles.column, { flex: 1 }]}>
              <Text style={styles.label}>Quantidade</Text>
              <TextInput 
                style={styles.input} 
                value={qty}
                onChangeText={setQty}
                keyboardType="numeric" 
                placeholder="1"
                placeholderTextColor="#999"
              />
            </View>
          </View>
  
          <TouchableOpacity style={styles.addButton} onPress={addProduct}>
            <Ionicons name="add-circle-outline" size={20} color="#000" style={styles.addIcon} />
            <Text style={styles.addButtonText}>Adicionar Produto</Text>
          </TouchableOpacity>
        </View>
  
        {/* Lista de produtos */}
        <View style={{ padding: 10}}>
          <View style={styles.sectionHeader}>
            <Ionicons name="cart-outline" size={22} color="#000" style={styles.sectionIcon} />
            <Text style={styles.sectionTitle}>
              Produtos ({orderData.produtos.length} {orderData.produtos.length === 1 ? 'item' : 'itens'})
            </Text>
          </View>
    
          {orderData.produtos.length === 0 ? (
            <Text style={styles.emptyText}>Nenhum produto adicionado</Text>
          ) : (
            <ScrollView 
              style={styles.productsList}
              showsVerticalScrollIndicator={false}
            >
              {orderData.produtos.map((produto) => (
                <View key={produto.id} style={styles.productItem}>
                  <View style={styles.productInfo}>
                    <Feather name="package" size={18} color="#000" />
                    <Text style={styles.productName} numberOfLines={1}>
                      {produto.nome}
                    </Text>
                  </View>
                  
                  <View style={styles.productControls}>
                    <View style={styles.quantityControls}>
                      <TouchableOpacity onPress={() => decreaseQty(produto.id)}>
                        <Feather name="minus-square" size={22} color="#000" />
                      </TouchableOpacity>
                      
                      <Text style={styles.quantityText}>{produto.quantidade}</Text>
                      
                      <TouchableOpacity onPress={() => increaseQty(produto.id)}>
                        <Feather name="plus-square" size={22} color="#000" />
                      </TouchableOpacity>
                    </View>
                    
                    <Text style={styles.productPrice}>
                      R$ {(produto.quantidade * produto.preco).toFixed(2).replace('.', ',')}
                    </Text>
                    
                    <TouchableOpacity 
                      style={styles.removeButton}
                      onPress={() => removeProduct(produto.id)}
                    >
                      <Ionicons name="trash-outline" size={20} color="#DC2626" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </ScrollView>
          )}
        </View>
        
  
        {/* Total */}
        {orderData.produtos.length > 0 && (
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total do Pedido:</Text>
            <Text style={styles.totalValue}>
              R$ {calculateTotal().toFixed(2).replace('.', ',')}
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E6E6E6',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
    marginTop: 15
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
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    margin: 10
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    color: '#333',
    marginLeft: 8,
  },
  label: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: '#333',
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontFamily: FONTS.regular,
    backgroundColor: '#FFF',
  },
  row: {
    flexDirection: 'row',
    marginHorizontal: -6,
  },
  column: {
    flex: 1,
    paddingHorizontal: 6,
  },
  addButton: {
    backgroundColor: '#E8E8E8',
    borderRadius: 8,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  addIcon: {
    marginRight: 8,
  },
  addButtonText: {
    fontSize: 16,
    fontFamily: FONTS.medium,
    color: '#333',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionIcon: {
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: '#333',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: '#666',
    fontStyle: 'italic',
    padding: 40,
  },
  productsList: {
    maxHeight: 300,
    marginBottom: 20,
  },
  productItem: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  productInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  productName: {
    fontSize: 15,
    fontFamily: FONTS.medium,
    color: '#333',
    marginLeft: 10,
    flex: 1,
  },
  productControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  quantityText: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    marginHorizontal: 10,
    minWidth: 24,
    textAlign: 'center',
  },
  productPrice: {
    fontSize: 15,
    fontFamily: FONTS.medium,
    color: '#333',
    marginRight: 16,
  },
  removeButton: {
    padding: 4,
  },
  totalContainer: {
    backgroundColor: '#E6E6E6',
    borderRadius: 8,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 10,
  },
  totalLabel: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: '#333',
  },
  totalValue: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    color: '#007AFF',
  },
});