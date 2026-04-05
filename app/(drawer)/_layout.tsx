import { Drawer } from 'expo-router/drawer';
import PreviousChatsScreen from '../../src/screens/ai chat/components/ChatHistory';

export default function DrawerLayout() {
  return (
    <Drawer
      drawerContent={(props) => <PreviousChatsScreen  />} // This is the key!
      screenOptions={{
        headerShown: false,
        drawerType: 'slide',
        drawerStyle: { width: 280 },
      }}
    >
      {/* Keep this hidden from the list if you are manualy rendering history, 
         or use it as the "Active" screen 
      */}
      <Drawer.Screen
        name="ChatHistory"
        options={{ drawerItemStyle: { display: 'none' } }} 
      />
    </Drawer>
  );
}