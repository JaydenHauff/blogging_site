
'use client';
import { useActionState, useEffect } from 'react';
import SectionTitle from '@/components/ui/section-title';
import TranslucentContainer from '@/components/ui/translucent-container';
import { Button } from '@/components/ui/button';
import { MOCK_BLOG_POSTS } from '@/lib/constants';
import { deleteCategoryAction } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Tag } from 'lucide-react';

interface CategoryActionState {
  message: string | null;
  isError?: boolean;
}

function DeleteCategoryButton({ categoryName }: { categoryName: string }) {
  const { toast } = useToast();
  const initialState: CategoryActionState = { message: null };
  const [state, formAction] = useActionState(deleteCategoryAction, initialState);

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.isError ? 'Error Deleting Category' : 'Category Action',
        description: state.message,
        variant: state.isError ? 'destructive' : 'default',
      });
    }
  }, [state, toast]);

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to "delete" the category: "${categoryName}"? This action is simulated and won't remove posts from this category.`)) {
      const formData = new FormData();
      formData.append('categoryName', categoryName);
      formAction(formData);
    }
  };

  return (
    <Button variant="destructive" size="sm" onClick={handleDelete} aria-label={`Delete category ${categoryName}`}>
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}

export default function ManageCategoriesPage() {
  const categories = Array.from(new Set(MOCK_BLOG_POSTS.map(p => p.category).filter(Boolean))) as string[];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <SectionTitle 
        title="Manage Categories" 
        subtitle={`Found ${categories.length} unique categories from blog posts.`}
        alignment="left"
      />
      {categories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <TranslucentContainer 
              key={category}
              baseColor="card" 
              backgroundOpacity={70} 
              padding="p-6"
              className="flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center mb-3">
                  <Tag className="h-5 w-5 mr-2 text-primary" />
                  <h3 className="text-xl font-semibold text-primary truncate">{category}</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  {/* You could count posts in this category here */}
                  {MOCK_BLOG_POSTS.filter(p => p.category === category).length} post(s)
                </p>
              </div>
              <div className="text-right">
                <DeleteCategoryButton categoryName={category} />
              </div>
            </TranslucentContainer>
          ))}
        </div>
      ) : (
         <TranslucentContainer 
            baseColor="card" 
            backgroundOpacity={70} 
            padding="p-8 md:p-10"
            className="text-center"
          >
          <p className="text-lg text-foreground/80">No categories found in blog posts.</p>
        </TranslucentContainer>
      )}
      <div className="mt-8 p-4 bg-secondary/30 rounded-md text-sm text-muted-foreground">
          <strong>Note:</strong> "Delete" actions for categories are simulated (logged to console) and do not persistently alter data or remove posts from this category.
          A real backend database is required for robust category management.
      </div>
    </div>
  );
}
