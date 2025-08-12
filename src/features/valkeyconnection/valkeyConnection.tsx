
import { useState } from 'react';
import { setConnecting as valkeySetConnecting } from './valkeyConnectionSlice';
import { useAppDispatch } from '../../hooks/hooks';
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function Connection() {
    const dispatch = useAppDispatch();
    const [host, setHost] = useState('localhost')
    const [port, setPort] = useState('6379')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(valkeySetConnecting({ status: true, host, port, username, password }))
    }

    return (
        <div>
            <div className="flex items-center justify-center min-h-screen">
                <Card className="w-full max-w-sm">
                    <CardHeader>
                        <CardTitle>Connect to Valkey</CardTitle>
                        <CardDescription>
                            Enter your server's host and port to connect.
                        </CardDescription>

                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit}>
                            <div className="flex flex-col gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="host">Host</Label>
                                    <Input
                                        id="host"
                                        type="text"
                                        value={host}
                                        placeholder="localhost"
                                        required
                                        onChange={e => setHost(e.target.value)}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="port">Port</Label>
                                    <Input
                                        id="port"
                                        type="number"
                                        value={port}
                                        placeholder="6379"
                                        required
                                        onChange={e => setPort(e.target.value)}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <div className="flex items-center">
                                        <Label htmlFor="username">Username</Label>
                                    </div>
                                    <Input id="username" type="username" onChange={e => setUsername(e.target.value)} />
                                </div>
                                <div className="grid gap-2">
                                    <div className="flex items-center">
                                        <Label htmlFor="password">Password</Label>
                                    </div>
                                    <Input id="password" type="password" onChange={(e) => setPassword(e.target.value)} />
                                </div>
                            </div>
                            <div className="grid gap-2 mt-8">
                                <Button type="submit" className="w-full">
                                    Connect
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>

    )
}