
'use client';
import { useActionState, useEffect, useRef } from 'react';
import SectionTitle from '@/components/ui/section-title';
import TranslucentContainer from '@/components/ui/translucent-container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MOCK_BLOG_POSTS } from '@/lib/constants';
import { deleteCategoryAction, createCategoryAction } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Tag, PlusCircle } from 'lucide-react';
import { useFormStatus } from 'react-dom';

interface CategoryActionState {
  message: string | null;
  isError?: boolean;
  errors?: any;
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

function CreateCategorySubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="w-full sm:w-auto">
        {pending ? 'Adding Category...' : <><PlusCircle className="h-4 w-4 mr-2" /> Add Category</>}
        </Button>
    );
}

function AddCategoryForm() {
  const { toast } = useToast();
  const initialState: CategoryActionState = { message: null };
  const [state, formAction] = useActionState(createCategoryAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.isError ? 'Error Adding Category' : 'Category Action',
        description: state.message,
        variant: state.isError ? 'destructive' : 'default',
      });
      if (!state.isError && formRef.current) {
        formRef.current.reset();
      }
    }
  }, [state, toast]);

  return (
    <TranslucentContainer
      baseColor="card"
      backgroundOpacity={80}
      padding="p-6 md:p-8"
      shadow="shadow-lg"
      rounded="rounded-lg"
      className="mb-12"
    >
      <h3 className="text-2xl font-headline font-semibold text-primary mb-6">Add New Category</h3>
      <form ref={formRef} action={formAction} className="space-y-6">
        <div>
          <Label htmlFor="categoryName">Category Name</Label>
          <Input id="categoryName" name="categoryName" placeholder="e.g., Artificial Intelligence" required className="mt-1" />
          {state.errors?.categoryName && <p className="text-sm text-red-500 mt-1">{state.errors.categoryName[0]}</p>}
        </div>
        <div>
          <Label htmlFor="categoryDescription">Category Description (Optional)</Label>
          <Textarea id="categoryDescription" name="categoryDescription" placeholder="A brief description of the category." rows={3} className="mt-1" />
          {state.errors?.categoryDescription && <p className="text-sm text-red-500 mt-1">{state.errors.categoryDescription[0]}</p>}
        </div>
        <div className="flex justify-end">
          <CreateCategorySubmitButton />
        </div>
      </form>
    </TranslucentContainer>
  );
}


export default function ManageCategoriesPage() {
  const categories = Array.from(new Set(MOCK_BLOG_POSTS.map(p => p.category).filter(Boolean))) as string[];

  return (
    <>
      <SectionTitle 
        title="Manage Categories" 
        subtitle={`Control your content organization. Found ${categories.length} unique categories from blog posts.`}
        alignment="left"
      />

      <AddCategoryForm />
      
      <h3 className="text-2xl font-headline font-semibold text-primary mb-6">Existing Categories</h3>
      {categories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <TranslucentContainer 
              key={category}
              baseColor="card" 
              backgroundOpacity={80} 
              padding="p-6"
              className="flex flex-col justify-between"
              shadow="shadow-lg"
              rounded="rounded-lg"
            >
              <div>
                <div className="flex items-center mb-3">
                  <Tag className="h-5 w-5 mr-2 text-primary" />
                  <h3 className="text-xl font-semibold text-primary truncate">{category}</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
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
            shadow="shadow-xl"
            rounded="rounded-lg"
          >
          <p className="text-lg text-foreground/80">No categories found in blog posts. You can "add" new categories using the form above, but they will only appear here if a blog post uses them (mock behavior).</p>
        </TranslucentContainer>
      )}
      <div className="mt-8 p-4 bg-secondary/30 rounded-md text-sm text-muted-foreground">
          <strong>Note:</strong> "Add" and "Delete" actions for categories are simulated (logged to console). 
          Newly "added" categories won't appear in the list below unless a blog post already uses that category name.
          Deletions do not persistently alter data or remove posts from this category.
          A real backend database is required for robust category management.
      </div>
    </>
  );
}
