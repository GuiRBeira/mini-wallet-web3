export const LoginButton = ({ onConnect, isConnecting }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 w-full">
      <p className="text-lg text-gray-500 font-medium">
        Conecte sua carteira para acessar o DApp.
      </p>
      <button
        onClick={onConnect}
        disabled={isConnecting}
        className={`
        flex items-center justify-center gap-2
        px-8 py-3 rounded-md font-bold text-white shadow-md
        transition-all duration-200 active:scale-95
        ${isConnecting ? 'bg-orange-300 cursor-not-allowed opacity-80' :
            'bg-orange-500 hover:bg-orange600 hover:translate-y-0.5 hover:shadow-lg'
          }
        `}
      >
        {isConnecting ? "Conectando..." :  "Conectar MetaMask"}
      </button>
    </div>
  )
}
