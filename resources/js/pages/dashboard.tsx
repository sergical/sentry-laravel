import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import * as Sentry from '@sentry/react';
import { useEffect, useState } from 'react';

interface Todo {
    id: number;
    title: string;
    description?: string;
    completed: boolean;
    created_at: string;
}

interface Props {
    todos: Todo[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard({ todos }: Props) {
    const [isCreating, setIsCreating] = useState(false);
    const [ooopsieMode, setOoopsieMode] = useState(false);
    const { auth } = usePage<SharedData>().props;

    const { data, setData, processing, errors, reset } = useForm<{
        title: string;
        description: string;
    }>({
        title: '',
        description: '',
    });

    // Set up Sentry user identification
    useEffect(() => {
        if (auth?.user) {
            Sentry.setUser({
                id: auth.user.id.toString(),
                username: auth.user.name,
                email: auth.user.email,
            });
        }
    }, [auth]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Use router.post directly to ensure ooopsieMode is included in the request
        router.post(
            route('todos.store'),
            {
                title: data.title,
                description: data.description,
                ooopsieMode: ooopsieMode,
            },
            {
                onSuccess: () => {
                    reset();
                    setIsCreating(false);
                },
                onError: (errors) => {
                    console.error('Server error while creating todo:', errors);
                    if (ooopsieMode) {
                        // Capture the server error in Sentry with additional context
                        Sentry.captureException(new Error('Server error caught on frontend while creating todo in ooopsie mode'), {
                            tags: { feature: 'todo-create', ooopsieMode: true },
                            user: { id: auth.user.id.toString(), email: auth.user.email, username: auth.user.name },
                            extra: { todoData: { title: data.title, description: data.description }, serverErrors: errors },
                        });
                        alert('Oops! The server encountered an error while creating the todo (this is a test error)');
                    }
                },
            },
        );
    };

    const toggleCompleted = (todo: Todo) => {
        router.patch(
            route('todos.update', todo.id),
            {
                completed: !todo.completed,
                ooopsieMode: ooopsieMode,
            },
            {
                preserveScroll: true,
                onError: (errors) => {
                    console.error('Server error while toggling todo:', errors);
                    if (ooopsieMode) {
                        // Capture the server error in Sentry with additional context
                        Sentry.captureException(new Error(`Server error caught on frontend while toggling todo "${todo.title}" in ooopsie mode`), {
                            tags: { feature: 'todo-toggle', ooopsieMode: true },
                            user: { id: auth.user.id.toString(), email: auth.user.email, username: auth.user.name },
                            extra: { todoId: todo.id, todoTitle: todo.title, newState: !todo.completed, serverErrors: errors },
                        });
                        alert(`Oops! The server encountered an error while toggling "${todo.title}" (this is a test error)`);
                    }
                },
            },
        );
    };

    const deleteTodo = (todo: Todo) => {
        if (!confirm('Are you sure you want to delete this todo?')) {
            return;
        }

        router.delete(route('todos.destroy', todo.id), {
            data: {
                ooopsieMode: ooopsieMode,
            },
            onError: (errors) => {
                console.error('Server error while deleting todo:', errors);
                if (ooopsieMode) {
                    // Capture the server error in Sentry with additional context
                    Sentry.captureException(new Error(`Server error caught on frontend while deleting todo "${todo.title}" in ooopsie mode`), {
                        tags: { feature: 'todo-delete', ooopsieMode: true },
                        user: { id: auth.user.id.toString(), email: auth.user.email, username: auth.user.name },
                        extra: { todoId: todo.id, todoTitle: todo.title, serverErrors: errors },
                    });
                    alert(`Oops! The server encountered an error while deleting "${todo.title}" (this is a test error)`);
                }
            },
        });
    };

    const handleOoopsieModeToggle = (enabled: boolean) => {
        setOoopsieMode(enabled);

        // Add breadcrumb for Sentry tracking
        Sentry.addBreadcrumb({
            message: `User ${enabled ? 'activated' : 'deactivated'} Ooopsie mode`,
            level: 'info',
            data: {
                userId: auth.user.id,
                userEmail: auth.user.email,
                ooopsieMode: enabled,
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {/* Sentry Testing Toggle */}
                <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-orange-800 dark:text-orange-200">🧪 Sentry Testing</CardTitle>
                                <p className="mt-1 text-sm text-orange-600 dark:text-orange-400">
                                    Toggle to trigger a server error for testing Sentry error tracking and session replay
                                </p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Label htmlFor="ooopsie-mode" className="text-sm font-medium text-orange-800 dark:text-orange-200">
                                    Ooopsie Mode
                                </Label>
                                <Switch id="ooopsie-mode" checked={ooopsieMode} onCheckedChange={handleOoopsieModeToggle} />
                            </div>
                        </div>
                    </CardHeader>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>My Todos</CardTitle>
                        <Button onClick={() => setIsCreating(!isCreating)} variant={isCreating ? 'outline' : 'default'}>
                            {isCreating ? 'Cancel' : 'Add Todo'}
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {isCreating && (
                            <form onSubmit={handleSubmit} className="mb-6 space-y-4 rounded-lg border p-4">
                                <div>
                                    <Label htmlFor="title">Title</Label>
                                    <Input
                                        id="title"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        placeholder="Enter todo title"
                                        className={errors.title ? 'border-red-500' : ''}
                                    />
                                    {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="description">Description (Optional)</Label>
                                    <Input
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        placeholder="Enter todo description"
                                    />
                                </div>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Creating...' : 'Create Todo'}
                                </Button>
                            </form>
                        )}

                        <div className="space-y-2">
                            {todos.length === 0 ? (
                                <p className="py-8 text-center text-muted-foreground">No todos yet. Create your first todo above!</p>
                            ) : (
                                todos.map((todo) => (
                                    <div
                                        key={todo.id}
                                        className={`flex items-center space-x-3 rounded-lg border p-3 ${todo.completed ? 'bg-muted/50' : ''}`}
                                    >
                                        <Checkbox checked={todo.completed} onCheckedChange={() => toggleCompleted(todo)} />
                                        <div className="flex-1">
                                            <h3 className={`font-medium ${todo.completed ? 'text-muted-foreground line-through' : ''}`}>
                                                {todo.title}
                                            </h3>
                                            {todo.description && (
                                                <p
                                                    className={`text-sm ${todo.completed ? 'text-muted-foreground line-through' : 'text-muted-foreground'}`}
                                                >
                                                    {todo.description}
                                                </p>
                                            )}
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => deleteTodo(todo)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
