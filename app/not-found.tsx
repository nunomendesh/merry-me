// app/not-found.tsx
import Link from 'next/link';
import { Button, Result } from 'antd';

export default function NotFound() {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f0f2f5' }}>
            <Result
                status="404"
                title="404"
                subTitle="Извините, запрашиваемая страница не найдена."
                extra={
                    <Link href="/">
                        <Button type="primary">На главную</Button>
                    </Link>
                }
            />
        </div>
    );
}