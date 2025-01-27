import { useNavigate } from "react-router-dom";

interface HeaderProps {
  name: string;
  email: string;
}
const Header = ({email, name}: HeaderProps) => {
  const navigate = useNavigate();

    return (
        <header className="bg-gray-100 py-4 shadow-lg">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center ml-5">
              <img src="eva.avif" alt="Logo da empresa" className="h-8 w-auto mr-4" />
            </div>
            <nav className="flex items-center mr-4">
              <ul className="flex space-x-4">
                <li className="text-gray-700 hover:text-gray-900">{name}</li>
                <li className="text-gray-700 hover:text-gray-900">{email}</li>
                <li onClick={() => {
                    localStorage.removeItem('token');
                    navigate('/');
                  }
                } className="text-red-700 hover:text-gray-900 cursor-pointer">sair</li>
              </ul>
            </nav>
          </div>
        </header>
    );
};

export default Header;