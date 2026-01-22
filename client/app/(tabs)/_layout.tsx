import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { FONTS } from '@/assets/fonts/fonts';

export default function TabLayout() {
  return (
      <Tabs screenOptions={{ 
        headerShown: false, 
        tabBarActiveTintColor: '#fffff',
        tabBarStyle: {
            height: 85,
            backgroundColor: '#ffffff',
            borderRadius: 30,
            position: 'absolute',
          },
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: FONTS.regular,
          paddingTop: 3,
        },
        tabBarIconStyle: {
          marginTop: 4,
          marginBottom: 0,
        },
      }}>
        <Tabs.Screen 
          name="home"
          
          options={{
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color} size={focused ? 28 : 24} />
            ),
            title: "Home"
          }}
        />
        <Tabs.Screen 
          name="order" 
          options={{
            tabBarIcon: ({ color, focused }) => (
              <MaterialCommunityIcons name={focused ? 'clipboard-text-multiple' : 'clipboard-text-multiple-outline'} size={focused ? 28 : 24} color={color} />
            ),
            title: "Pedidos"
          }}
        />
        <Tabs.Screen
          name="create-order"
          options={{
            tabBarLabel: () => null,
            tabBarIcon: ({ color, focused }) => (
              <FontAwesome
                name={focused ? 'plus-square' : 'plus-square-o'}
                size={focused ? 29 : 33} 
                color={color}
              />
            ),
            tabBarIconStyle: { marginTop: 10 },
          }}
        />
        <Tabs.Screen
          name="financial"
          options={{
            tabBarIcon: ({color, focused}) => (
              <FontAwesome6 name={focused ? 'money-bill-1-wave' : 'money-bill-1'} size={focused ? 28 : 24} color={color} />
            ),
            title: "Finanças"
          }}
        />
        <Tabs.Screen 
          name="tasks"
          options={{
            tabBarIcon: ({color, focused}) => (
              <MaterialCommunityIcons name={focused ? 'list-box' : 'list-box-outline'} size={focused ? 28 : 24} color={color} />
            ),
            title: "Tarefas"
          }}
        />
      </Tabs>
  );
}


