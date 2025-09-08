import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-gradient-to-br from-blue-600 to-purple-600 text-white">
                <div className="text-xs font-bold">🧠</div>
            </div>
            <div className="ml-2 grid flex-1 text-left text-sm min-w-0">
                <span className="truncate leading-tight font-semibold">Psicología Deportiva</span>
                <span className="truncate text-xs text-muted-foreground">Mental Training</span>
            </div>
        </>
    );
}
