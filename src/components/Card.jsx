const Card = ({ children, onClick, selected, bgColor }) => {
  const borderColor = selected ? "border-sky-800" : "border-sky-950"; // Use default or selected border color

  return (
    <div className={`${bgColor} border-4 ${borderColor} hover:border-sky-700 hover:cursor-pointer rounded-lg overflow-hidden transition-transform transform hover:scale-105`} onClick={onClick}>
      {children}
    </div>
  );
};

const CardHeader = ({ bgColor, children }) => <div className={`text-center py-4 ${bgColor} text-white`}>{children}</div>;

const CardTitle = ({ children }) => <h3 className="text-xl font-semibold">{children}</h3>;

const CardContent = ({ children }) => <div className="flex flex-col items-center gap-4 px-2 py-4">{children}</div>;

export { Card, CardHeader, CardTitle, CardContent };
