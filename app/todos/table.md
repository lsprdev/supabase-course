## Supabase Todos Table

```sql
-- Create the todos table
CREATE TABLE public.todos (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    description TEXT NOT NULL,
    is_complete BOOLEAN DEFAULT FALSE,
    inserted_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::TEXT, now())
);

-- Enable row-level security for the todos table
ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own todos
CREATE POLICY "Users can view their own todos."
ON public.todos
FOR SELECT
USING (
    user_id = auth.uid()
);

-- Policy: Users can insert their own todos
CREATE POLICY "Users can insert their own todos."
ON public.todos
FOR INSERT
WITH CHECK (
    user_id = auth.uid()
);

-- Policy: Users can update their own todos
CREATE POLICY "Users can update their own todos."
ON public.todos
FOR UPDATE
USING (
    user_id = auth.uid()
);

-- Policy: Users can delete their own todos
CREATE POLICY "Users can delete their own todos."
ON public.todos
FOR DELETE
USING (
    user_id = auth.uid()
);
```