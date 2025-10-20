import { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon(props: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img
            {...props}
            src="/images/logo-empresa.jpeg"
            alt="App Logo"
            style={{
                aspectRatio: '40/42',
                ...props.style
            }}
        />
    );
}
