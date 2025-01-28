import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiLogged from '../../services/apiLooged';
import JourneyModal from '../../components/JourneyModal';
import Header from '../../components/Header';
import {jwtDecode} from 'jwt-decode';

interface JourneyProps {
  token: string
  setToken: (token: string) => void
}
const Journey = ({token, setToken}: JourneyProps) => {
    const [journeys, setJourneys] = useState<any[]>([]);
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const navigate = useNavigate();
    const [updateList, setUpdateList] = useState(false);
  
    useEffect(() => {
      if (token != "") {
        getJourneys();
      }
    }, [token,setToken]);
  
    useEffect(() => {
      if (token === "") {
        navigate('/', { replace: true });
      } else {
        const decodedToken = jwtDecode(token ?? '') as {email: string, name: string};
        setEmail(decodedToken.email);
        setName(decodedToken.name);
      }
    }, [token, setToken]);

    async function getJourneys() {
      try {
        apiLogged.get('/journeys',{
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }).then((response) => {
          setJourneys(response.data.journeys);
        });
      } catch (error) {
        console.error(error);
      }
    };

    useEffect(() => {
      if (updateList) {
        setUpdateList(false);
        getJourneys();
      }
    }, [updateList]);

    return (
      <>
        <Header name={name} email = {email}/>
        <div className="container mx-auto p-4">
          <div className="flex justify-end mb-4">
            <button onClick={() => setModalOpen(true)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Nova Jornada
            </button>
            <button onClick={() => getJourneys()} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Atualizar lista
            </button>
          </div>
          <div>
            <div className="overflow-x-auto">
              <table className="table-auto w-full">
                <thead className="bg-gray-100">
                <tr>
                    <th className="px-4 py-2">Nome</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">ID - Ação</th>
                    <th className="px-4 py-2">ID - Colaborador</th>
                    <th className="px-4 py-2">Data de envio</th>
                </tr>
                </thead>
                <tbody>
                {journeys.length > 0 && journeys.map((journey) => (
                    <tr key={journey.id}>
                    <td className="border px-4 py-2 text-center">{journey.name}</td>
                    <td className="border px-4 py-2 text-center">{journey.status}</td>
                    <td className="border px-4 py-2 text-center">
                        { journey.actions.map((action: any) => (
                          <p key={action}>{action}</p>
                        ))}
                    </td>
                    <td className="border px-4 py-2 text-center">
                    { journey.collaborators.map((collaborator: any) => (
                          <p key={collaborator}>{collaborator}</p>
                        ))}
                    </td>
                    <td className="border px-4 py-2 text-center">{journey.start_date}</td>
                    </tr>
                ))}
                </tbody>
              </table>
            </div>

          </div>
          {modalOpen && (
            <JourneyModal setUpdateList={setUpdateList} setOpen={setModalOpen} token={token} setToken={setToken} />
          )}
        </div>
      </>
    );
};

export default Journey;