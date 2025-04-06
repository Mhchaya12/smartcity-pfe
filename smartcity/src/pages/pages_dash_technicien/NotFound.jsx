import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "../../components/components_dash_technicien/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="w-full max-w-md text-center space-y-6 p-8 animate-fade-in">
        <div className="w-24 h-24 bg-tech-blue/20 rounded-full flex items-center justify-center mx-auto">
          <span className="text-4xl font-bold text-tech-blue">404</span>
        </div>
        <h1 className="text-2xl font-bold">Page introuvable</h1>
        <p className="text-muted-foreground">
          La page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <Button asChild className="mt-4">
          <Link to="/">Retour au tableau de bord</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound; 