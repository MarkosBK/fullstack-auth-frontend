import { paths } from '@/lib/utils/paths';
import { router } from 'expo-router';
import { Alert, TouchableOpacity, View } from 'react-native';
import { LabelLarge, LabelMedium } from '@/components/typography';
import { Button } from '@/components/common';
import { getErrorMessage } from '@/lib/utils/errorHandler';
import { useAuth } from '@/providers/AuthProvider';
import { useEffect } from 'react';

const ProfileScreen = () => {
  const { isAuthenticated, currentUser, isLoading, logout, refetchUser } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error: any) {
      const errorMessage = getErrorMessage(error);
      Alert.alert('Error', errorMessage);
    }
  };

  useEffect(() => {
    console.log('currentUser', currentUser);
  }, [currentUser]);

  useEffect(() => {
    console.log('isAuthenticated', isAuthenticated);
  }, [isAuthenticated]);

  return (
    <View className="flex-1 items-center justify-center bg-background">
      <TouchableOpacity onPress={() => router.push(paths.app.settings.path)}>
        <LabelLarge>Settings</LabelLarge>
      </TouchableOpacity>

      <LabelLarge className="mb-2 text-lg font-semibold">
        Welcome, {currentUser?.displayName || 'User'}!
      </LabelLarge>
      <LabelMedium className="text-gray-600">{currentUser?.email}</LabelMedium>

      <Button onPress={handleLogout} loading={isLoading}>
        Logout
      </Button>

      <Button onPress={() => refetchUser()} loading={isLoading}>
        Update Profile
      </Button>
    </View>
  );
};

export default ProfileScreen;
