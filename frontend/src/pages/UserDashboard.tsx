import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { storeAPI, ratingAPI, authAPI } from '@/lib/api';
import { useStoreStore, Store } from '@/stores/storeStore';
import { useAuthStore } from '@/stores/authStore';
import { useToast } from '@/hooks/use-toast';
import { Star, Search, MapPin, Edit } from 'lucide-react';

const ratingSchema = z.object({
  rating: z.number().min(1).max(5),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(16, 'Password must not exceed 16 characters')
    .regex(/^(?=.*[A-Z])(?=.*[!@#$%^&*])/, 'Password must include at least one uppercase letter and one special character'),
});

type RatingForm = z.infer<typeof ratingSchema>;
type PasswordForm = z.infer<typeof passwordSchema>;

export const UserDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [isRatingDialogOpen, setIsRatingDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const { stores, setStores, updateStoreRating } = useStoreStore();
  const { user } = useAuthStore();
  const { toast } = useToast();

  const ratingForm = useForm<RatingForm>({
    resolver: zodResolver(ratingSchema),
    defaultValues: {
      rating: 5,
    },
  });

  const passwordForm = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
    },
  });

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      const response = await storeAPI.getAllStores();
      setStores(response.data);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to fetch stores',
        variant: 'destructive',
      });
    }
  };

  const filteredStores = stores.filter(store =>
    store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onSubmitRating = async (data: RatingForm) => {
    if (!selectedStore) return;

    try {
      await ratingAPI.submitRating({
        storeId: selectedStore.id,
        rating: data.rating,
      });

      updateStoreRating(selectedStore.id, selectedStore.rating, data.rating);
      
      toast({
        title: 'Success',
        description: 'Rating submitted successfully',
      });
      
      setIsRatingDialogOpen(false);
      ratingForm.reset();
      setSelectedStore(null);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to submit rating',
        variant: 'destructive',
      });
    }
  };

  const onUpdatePassword = async (data: PasswordForm) => {
    try {
      await authAPI.resetPassword(data as any);
      toast({
        title: 'Success',
        description: 'Password updated successfully',
      });
      setIsPasswordDialogOpen(false);
      passwordForm.reset();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update password',
        variant: 'destructive',
      });
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {user?.name}</h1>
          <p className="text-muted-foreground">Discover and rate stores</p>
        </div>
        <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Edit className="w-4 h-4 mr-2" />
              Update Password
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Password</DialogTitle>
              <DialogDescription>Change your account password</DialogDescription>
            </DialogHeader>
            <Form {...passwordForm}>
              <form onSubmit={passwordForm.handleSubmit(onUpdatePassword)} className="space-y-4">
                <FormField
                  control={passwordForm.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={passwordForm.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">Update Password</Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search stores by name or address..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Stores Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStores.map((store) => (
          <Card key={store.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex justify-between items-start">
                <span>{store.name}</span>
                {store.userRating && (
                  <Badge variant="secondary">
                    Your Rating: {store.userRating}
                  </Badge>
                )}
              </CardTitle>
              <CardDescription className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {store.address}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">Rating:</span>
                    <div className="flex items-center">
                      {renderStars(Math.round(store.rating || 0))}
                      <span className="ml-2 text-sm text-muted-foreground">
                        {store.rating ? `${store.rating.toFixed(1)}/5` : 'No ratings'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <Button
                  onClick={() => {
                    setSelectedStore(store);
                    ratingForm.setValue('rating', store.userRating || 5);
                    setIsRatingDialogOpen(true);
                  }}
                  className="w-full"
                  variant={store.userRating ? "outline" : "default"}
                >
                  {store.userRating ? 'Update Rating' : 'Rate Store'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Rating Dialog */}
      <Dialog open={isRatingDialogOpen} onOpenChange={setIsRatingDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rate {selectedStore?.name}</DialogTitle>
            <DialogDescription>
              Share your experience with this store
            </DialogDescription>
          </DialogHeader>
          <Form {...ratingForm}>
            <form onSubmit={ratingForm.handleSubmit(onSubmitRating)} className="space-y-4">
              <FormField
                control={ratingForm.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rating (1-5 stars)</FormLabel>
                    <FormControl>
                      <div className="flex space-x-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => field.onChange(star)}
                            className="focus:outline-none"
                          >
                            <Star
                              className={`w-8 h-8 transition-colors ${
                                star <= field.value
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300 hover:text-yellow-200'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">Submit Rating</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};