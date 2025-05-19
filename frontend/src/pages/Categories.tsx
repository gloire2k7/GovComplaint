import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

const Categories = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [newCategory, setNewCategory] = useState("");
  
  // If the current user is an agency, use their categories from the auth context
  // Otherwise, use an empty array
  const [categories, setCategories] = useState<string[]>(
    currentUser?.userType === 'agency' && currentUser.categories ? 
    [...currentUser.categories] : []
  );

  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      const updatedCategories = [...categories, newCategory.trim()];
      setCategories(updatedCategories);
      setNewCategory("");
      
      toast({
        title: "Category Added",
        description: `"${newCategory.trim()}" has been added to your complaint categories.`,
      });
    } else if (categories.includes(newCategory.trim())) {
      toast({
        title: "Duplicate Category",
        description: "This category already exists.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveCategory = (category: string) => {
    const updatedCategories = categories.filter(c => c !== category);
    setCategories(updatedCategories);
    
    toast({
      title: "Category Removed",
      description: `"${category}" has been removed from your complaint categories.`,
    });
  };

  const handleSaveChanges = () => {
    // In a real application, you would save the categories to the database
    toast({
      title: "Categories Updated",
      description: "Your complaint categories have been updated successfully.",
    });
  };

  if (!currentUser || currentUser.userType !== 'agency') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              Only government agencies can manage complaint categories.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button asChild>
              <Link to="/dashboard">Return to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Manage Complaint Categories</h1>
        <p className="text-gray-600">
          Add, remove, or modify the categories citizens can select when submitting complaints
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Your Complaint Categories</CardTitle>
          <CardDescription>
            These categories help citizens properly classify their complaints
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Add a new category..."
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="max-w-sm"
              />
              <Button 
                onClick={handleAddCategory}
                disabled={!newCategory.trim()}
              >
                Add
              </Button>
            </div>
            
            <div className="space-y-2">
              {categories.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {categories.map((category) => (
                    <div 
                      key={category} 
                      className="flex items-center justify-between bg-muted/50 p-3 rounded-md"
                    >
                      <span>{category}</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleRemoveCategory(category)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-100"
                      >
                        &times;
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No categories added yet. Add categories to help citizens classify their complaints.
                </div>
              )}
            </div>
            
            <div className="pt-4 flex justify-end">
              <Button 
                onClick={handleSaveChanges}
                className="bg-gov-blue hover:bg-gov-darkBlue"
                disabled={categories.length === 0}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Tips for Effective Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 list-disc list-inside text-sm">
            <li>Use clear, specific names that citizens can easily understand</li>
            <li>Create enough categories to properly classify complaints, but avoid too many overlapping options</li>
            <li>Consider the most common types of issues your agency addresses</li>
            <li>Review and update your categories regularly based on the complaints you receive</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default Categories;
