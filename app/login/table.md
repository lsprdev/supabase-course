## Supabase Profiles Table Creation

```sql
-- Create a table for public profiles
CREATE TABLE profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
    updated_at TIMESTAMP WITH TIME ZONE,
    username TEXT UNIQUE NOT NULL,
    full_name TEXT,
    CONSTRAINT username_length CHECK (char_length(username) >= 3)
);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles
    ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public profiles are viewable by everyone." ON profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile." ON profiles
    FOR INSERT WITH CHECK ((SELECT auth.uid()) = id);

CREATE POLICY "Users can update own profile." ON profiles
    FOR UPDATE USING ((SELECT auth.uid()) = id);

-- Trigger to auto-create a profile entry
CREATE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SET search_path = ''
AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name)
    VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```
