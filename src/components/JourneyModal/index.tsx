import { useEffect, useState } from 'react';
import apiLogged from '../../services/apiLooged';
import Toast from '../Toast';
import Joi from 'joi';

interface JourneyModalProps {
    setOpen: (o: boolean) => void
    setUpdateList: (o: boolean) => void
}

const schema = Joi.object({
  name: Joi.string().required(),
  actions: Joi.string().required(),
  start_date: Joi.date().required(),
  collaborators: Joi.string().required()
});

const JourneyModal = ({setOpen, setUpdateList}: JourneyModalProps) => {
    const [name, setName] = useState('');
    const [actions, setActions] = useState('');
    const [actionsOpts, setActionsOpts] = useState<Array<any>>([]);
    const [collaborators, setCollaborators] = useState('');
    const [collaboratorsOpts, setCollaboratorsOpts] = useState<Array<any>>([]);
    const [date, setDate] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [message, setMessage] = useState('');
    const [type, setType] = useState<'success' | 'error'>('success');
    const [errors, setErrors] = useState<{ [key: string]: string }>();
    const [tokenLoaded, setTokenLoaded] = useState(false);

    async function postJourney() {
        setErrors(undefined);
        const {error: errorValidation} = schema.validate({name, actions: actions, start_date: date, collaborators: collaborators});
        if (errorValidation) {
          setErrors(errorValidation.details.reduce((acc: { [key: string]: string }, curr) => {
            acc[curr.path[curr.path.length - 1]] = curr.message;
            return acc;
          }, {}));
        } else {
          apiLogged.post('/journey', {
            name,
            actions: [actions],
            collaborators: [collaborators],
            start_date: date
          }).then(() => {
              setShowToast(true);
              setMessage("Jornada criada com sucesso!");
              setType('success');
              setUpdateList(true);
          }).catch(() => {
              setShowToast(true);
              setMessage("Erro ao criar jornada!");
              setType('error');
          }).finally(() => {
              setTimeout(() => {
                  setOpen(false);
                }, 2000);
          });
        }
    };

    useEffect(() => {
      const token = localStorage.getItem('token');
      if (token) {
        setTokenLoaded(true);
      }
    }, []);
    

    useEffect(() => {
      if (!tokenLoaded) {
        return;
      }
      apiLogged.get('/collaborators').then((response) => {
        const collaborators = response.data;
        if (Array.isArray(collaborators.collaborators)) {
          setCollaboratorsOpts(collaborators.collaborators);
          setCollaborators(collaborators.collaborators[0].id);
        }
      }).catch((error) => {
        console.error(error);
      });
      }, [tokenLoaded]);

      useEffect(() => {
        apiLogged.get('/actions').then((response) => {
            const actions = response.data;
            if (Array.isArray(actions.actions)) {
              setActionsOpts(actions.actions);
              setActions(actions.actions[0].id);
            }
          }).catch((error) => {
            console.error(error);
          });
      }, []);

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-lg p-4 w-1/2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Jornada</h2>
              <button className="text-gray-500 hover:text-gray-900" onClick={() => setOpen(false)}>
                x
              </button>
            </div>
            <form onSubmit={(event) => {event.preventDefault(); postJourney();}}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">Nome:</label>
                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="name" type="text" value={name} onChange={(event) => setName(event.target.value)} />
                {errors && errors.name && (
                  <div className="text-red-500 text-sm mt-2">{errors.name}</div>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="actions">Ação:</label>
                <select className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline" id="actions" value={actions} onChange={(event) => {setActions(event.target.value)}}>
                {
                    actionsOpts.map((action: any) => (
                      <option key={action.id} value={action.id}>{action.name}</option>
                    ))
                  }
                </select>
                {errors && errors.actions && (
                  <div className="text-red-500 text-sm mt-2">{errors.actions}</div>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="collaborators">Colaborador:</label>
                <select className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline" id="collaborators" value={collaborators} onChange={(event) => setCollaborators(event.target.value)}>
                  {
                    collaboratorsOpts.map((collaborator: any) => (
                      <option key={collaborator.id} value={collaborator.id}>{collaborator.name}</option>
                    ))
                  }
                </select>
                {errors && errors.collaborators && (
                  <div className="text-red-500 text-sm mt-2">{errors.collaborators}</div>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date">Data de execução:</label>
                <input
                    type="datetime-local"
                    className="block w-full p-2 pl-10 text-sm text-gray-700 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    />
                {errors && errors.start_date && (
                  <div className="text-red-500 text-sm mt-2">{errors.start_date}</div>
                )}
              </div>
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="submit">Salvar</button>
            </form>
          </div>
          {
            showToast && (
              <Toast message={message} type={type} setMessage={setMessage} />
            )
          }
        </div>
    );
};

export default JourneyModal;