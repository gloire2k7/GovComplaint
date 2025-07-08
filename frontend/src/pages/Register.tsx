import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/contexts/AuthContext';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [userType, setUserType] = useState<'CITIZEN' | 'AGENCY'>('CITIZEN');
  const [agencyName, setAgencyName] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();

  const handleAddCategory = () => {
    const trimmed = newCategory.trim();
    if (trimmed && !categories.includes(trimmed)) {
      setCategories([...categories, trimmed]);
      setNewCategory('');
    }
  };

  const handleRemoveCategory = (category: string) => {
    setCategories(categories.filter(c => c !== category));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    let payload: any = {
      email,
      password,
      userType, // Set automatically based on tab
    };

    if (userType === 'CITIZEN') {
      payload.displayName = displayName;
    } else if (userType === 'AGENCY') {
      payload.agencyName = agencyName;
      payload.categories = categories;
    }

    try {
      await register(payload);
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gov-blue mb-2">GovComplaint</h1>
          <p className="text-gray-600">Connecting citizens with government agencies</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create an Account</CardTitle>
            <CardDescription>
              Register to start using the complaint system
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <Tabs defaultValue="CITIZEN" onValueChange={(value) => setUserType(value as 'CITIZEN' | 'AGENCY')}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="CITIZEN">Citizen</TabsTrigger>
                  <TabsTrigger value="AGENCY">Government Agency</TabsTrigger>
                </TabsList>

                <div className="mt-4 space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium">
                      Password
                    </label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="text-sm font-medium">
                      Confirm Password
                    </label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>

                  <TabsContent value="CITIZEN" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <label htmlFor="displayName" className="text-sm font-medium">
                        Full Name
                      </label>
                      <Input
                        id="displayName"
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        required={userType === 'CITIZEN'}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="AGENCY" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <label htmlFor="agencyName" className="text-sm font-medium">
                        Agency Name
                      </label>
                      <Input
                        id="agencyName"
                        type="text"
                        value={agencyName}
                        onChange={(e) => setAgencyName(e.target.value)}
                        required={userType === 'AGENCY'}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Complaint Categories
                      </label>
                      <div className="flex space-x-2">
                        <Input
                          placeholder="Add a category..."
                          value={newCategory}
                          onChange={(e) => setNewCategory(e.target.value)}
                        />
                        <Button
                          type="button"
                          onClick={handleAddCategory}
                          variant="outline"
                        >
                          Add
                        </Button>
                      </div>

                      <div className="mt-2 space-y-2">
                        {categories.map((category, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                            <span>{category}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveCategory(category)}
                              className="h-6 text-gray-500 hover:text-red-600"
                            >
                              &times;
                            </Button>
                          </div>
                        ))}
                        {categories.length === 0 && (
                          <p className="text-sm text-gray-500">No categories added yet</p>
                        )}
                      </div>
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full bg-gov-blue hover:bg-gov-darkBlue"
                disabled={isSubmitting || (userType === 'AGENCY' && categories.length === 0)}
              >
                {isSubmitting ? 'Creating account...' : 'Register'}
              </Button>

              <p className="text-sm text-center text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-gov-blue hover:underline font-medium">
                  Log in
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Register;
