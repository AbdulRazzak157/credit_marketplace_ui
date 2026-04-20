function CustomThreeDotsLoader({ color = "primary" }) {

    const hexColor = {
        primary: "text-(--primary)",
        white: "text-white",
        red: "text-red-500",
        green: "text-[#2E7D32]",
    };

    return (
        <div className={`flex items-center justify-center gap-1 ${hexColor[color]}`}>
            <span className="w-2.5 h-2.5 rounded-full bg-current dot-bounce" />
            <span className="w-2.5 h-2.5 rounded-full bg-current dot-bounce delay-1" />
            <span className="w-2.5 h-2.5 rounded-full bg-current dot-bounce delay-2" />
        </div>
    );
};

export default CustomThreeDotsLoader;