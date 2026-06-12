import { useEffect, useState } from 'react';
import DashboardNav from '../components/DashboardNav';
import HouseForm from '../components/HouseForm';
import { createHouse, deleteHouse, listHouses, updateHouse } from '../services/houseService';
import { listUsers } from '../services/userService';
import { getCurrentUser } from '../utils/authStorage';

const houseMatchesFilter = (house, filter) => {
  if (filter === 'all') {
    return true;
  }

  return house.status === filter;
};

const sortByIdAsc = (firstHouse, secondHouse) => firstHouse.id - secondHouse.id;

function HomePage() {
  const [currentUser] = useState(() => getCurrentUser());
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [usersError, setUsersError] = useState('');
  const [houseFilter, setHouseFilter] = useState('all');
  const [houses, setHouses] = useState([]);
  const [loadingHouses, setLoadingHouses] = useState(true);
  const [housesError, setHousesError] = useState('');
  const [activeHouseForm, setActiveHouseForm] = useState(null);
  const [savingHouse, setSavingHouse] = useState(false);
  const [deletingHouseId, setDeletingHouseId] = useState(null);
  const [openHouseMenuId, setOpenHouseMenuId] = useState(null);
  const [houseActionError, setHouseActionError] = useState('');

  const fetchUsers = async () => {
    setLoadingUsers(true);
    setUsersError('');

    try {
      const data = await listUsers();
      setUsers(data.users || []);
    } catch (error) {
      setUsersError(error.response?.data?.message || 'No se pudo cargar la lista de usuarios.');
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchHouses = async (status = houseFilter) => {
    setLoadingHouses(true);
    setHousesError('');

    try {
      const data = await listHouses(status);
      setHouses(data.houses || []);
    } catch (error) {
      setHousesError(error.response?.data?.message || 'No se pudo cargar la lista de inmuebles.');
    } finally {
      setLoadingHouses(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchHouses('all');
  }, []);

  const handleHouseFilterChange = async (nextFilter) => {
    setHouseFilter(nextFilter);
    setActiveHouseForm(null);
    setOpenHouseMenuId(null);
    setHouseActionError('');
    await fetchHouses(nextFilter);
  };

  const handleOpenCreateHouseForm = () => {
    setHouseActionError('');
    setOpenHouseMenuId(null);
    setActiveHouseForm({ mode: 'create', house: null });
  };

  const handleEditHouse = (house) => {
    setHouseActionError('');
    setOpenHouseMenuId(null);
    setActiveHouseForm({ mode: 'edit', house });
  };

  const handleCloseHouseForm = () => {
    setActiveHouseForm(null);
    setHouseActionError('');
  };

  const handleToggleHouseMenu = (houseId) => {
    setOpenHouseMenuId((current) => (current === houseId ? null : houseId));
  };

  const handleSubmitHouseForm = async (values) => {
    if (!activeHouseForm) {
      return;
    }

    setSavingHouse(true);
    setHouseActionError('');

    try {
      if (activeHouseForm.mode === 'create') {
        const response = await createHouse(values);
        const createdHouse = response.house;

        setHouses((current) => {
          if (!createdHouse || !houseMatchesFilter(createdHouse, houseFilter)) {
            return current;
          }

          return [...current, createdHouse].sort(sortByIdAsc);
        });
      } else {
        const response = await updateHouse(activeHouseForm.house.id, values);
        const updatedHouse = response.house;

        setHouses((current) => {
          if (!updatedHouse) {
            return current;
          }

          const existsInCurrentList = current.some((house) => house.id === updatedHouse.id);
          const shouldBeVisible = houseMatchesFilter(updatedHouse, houseFilter);

          if (!shouldBeVisible) {
            return current.filter((house) => house.id !== updatedHouse.id);
          }

          if (!existsInCurrentList) {
            return [...current, updatedHouse].sort(sortByIdAsc);
          }

          return current.map((house) => (house.id === updatedHouse.id ? updatedHouse : house));
        });
      }

      setActiveHouseForm(null);
    } catch (error) {
      setHouseActionError(error.response?.data?.message || 'No se pudo guardar el inmueble.');
    } finally {
      setSavingHouse(false);
    }
  };

  const handleDeleteHouse = async (houseId) => {
    const confirmed = window.confirm('Eliminar este inmueble?');

    if (!confirmed) {
      return;
    }

    setDeletingHouseId(houseId);
    setOpenHouseMenuId(null);
    setHouseActionError('');

    try {
      await deleteHouse(houseId);
      setHouses((current) => current.filter((house) => house.id !== houseId));
    } catch (error) {
      setHouseActionError(error.response?.data?.message || 'No se pudo eliminar el inmueble.');
    } finally {
      setDeletingHouseId(null);
    }
  };

  return (
    <main className="dashboard-shell">
      <section className="dashboard-card">
        <DashboardNav userName={currentUser?.name} />

        <header className="dashboard-header">
          <div>
            <h1 className="dashboard-header__title">
              Bienvenido{currentUser?.name ? `, ${currentUser.name}` : ''}
            </h1>
          </div>
        </header>

        <section className="dashboard-users">
          <div className="dashboard-users__head">
            <h2 className="dashboard-users__title">Usuarios</h2>
            <span className="dashboard-users__count">{users.length}</span>
          </div>

          {loadingUsers ? <p className="dashboard-users__state">Cargando usuarios...</p> : null}
          {usersError ? <p className="dashboard-users__error">{usersError}</p> : null}

          {!loadingUsers && !usersError ? (
            <div className="dashboard-users__table-wrap">
              <table className="dashboard-users__table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Correo</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((listedUser) => (
                    <tr key={listedUser.id}>
                      <td>{listedUser.name}</td>
                      <td>{listedUser.email}</td>
                      <td>{listedUser.isActive ? 'Activo' : 'Inactivo'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </section>

        <section className="dashboard-houses">
          <div className="dashboard-houses__head">
            <h2 className="dashboard-houses__title">Inmuebles</h2>
            <div className="dashboard-houses__head-right">
              <span className="dashboard-houses__count">{houses.length}</span>
              <button
                type="button"
                className="dashboard-houses__create-btn"
                onClick={handleOpenCreateHouseForm}
              >
                Crear inmueble
              </button>
            </div>
          </div>

          <div className="dashboard-houses__filters">
            {['all', 'available', 'sold'].map((statusKey) => (
              <button
                key={statusKey}
                type="button"
                onClick={() => handleHouseFilterChange(statusKey)}
                className={`dashboard-houses__filter-btn${houseFilter === statusKey ? ' is-active' : ''}`}
              >
                {statusKey === 'all'
                  ? 'Todos los inmuebles'
                  : statusKey === 'available'
                    ? 'Disponibles'
                    : 'Vendidas'}
              </button>
            ))}
          </div>

          {loadingHouses ? <p className="dashboard-houses__state">Cargando inmuebles...</p> : null}
          {housesError ? <p className="dashboard-houses__error">{housesError}</p> : null}
          {houseActionError ? <p className="dashboard-houses__error">{houseActionError}</p> : null}

          {activeHouseForm?.mode === 'create' ? (
            <HouseForm
              mode={activeHouseForm.mode}
              initialValues={activeHouseForm.house}
              onSubmit={handleSubmitHouseForm}
              onCancel={handleCloseHouseForm}
              loading={savingHouse}
            />
          ) : null}

          {!loadingHouses && !housesError ? (
            <div className="dashboard-houses__table-wrap">
              <table className="dashboard-houses__table">
                <thead>
                  <tr>
                    <th>Direccion</th>
                    <th>Precio</th>
                    <th>Estado</th>
                    <th>Propietario</th>
                  </tr>
                </thead>
                <tbody>
                  {houses.map((house) => {
                    const isOwnHouse = currentUser?.id === house.sellerId;
                    const isEditingThisRow =
                      activeHouseForm?.mode === 'edit' && activeHouseForm?.house?.id === house.id;
                    const ownerName =
                      users.find((listedUser) => listedUser.id === house.sellerId)?.name || 'Propietario desconocido';

                    if (isEditingThisRow) {
                      return (
                        <tr key={house.id}>
                          <td colSpan={4}>
                            <HouseForm
                              mode="edit"
                              variant="inline"
                              initialValues={house}
                              onSubmit={handleSubmitHouseForm}
                              onCancel={handleCloseHouseForm}
                              loading={savingHouse}
                            />
                          </td>
                        </tr>
                      );
                    }

                    return (
                      <tr key={house.id}>
                        <td>{house.address}</td>
                        <td>${Number(house.price).toLocaleString()}</td>
                        <td>
                          <span
                            className={`dashboard-houses__status ${house.status === 'sold' ? 'is-sold' : 'is-available'
                              }`}
                          >
                            {house.status === 'sold' ? 'Vendida' : 'Disponible'}
                          </span>
                        </td>
                        <td>
                          <div className="dashboard-houses__owner-cell">
                            <span>{ownerName}</span>
                            {isOwnHouse ? (
                              <div className="dashboard-houses__menu-wrap">
                                <button
                                  type="button"
                                  className="dashboard-houses__menu-trigger"
                                  onClick={() => handleToggleHouseMenu(house.id)}
                                  aria-label={`Abrir opciones para el inmueble ${house.id}`}
                                >
                                  ...
                                </button>

                                {openHouseMenuId === house.id ? (
                                  <div className="dashboard-houses__menu">
                                    <button type="button" onClick={() => handleEditHouse(house)}>
                                      Editar
                                    </button>
                                    <button
                                      type="button"
                                      className="is-danger"
                                      onClick={() => handleDeleteHouse(house.id)}
                                      disabled={deletingHouseId === house.id}
                                    >
                                      {deletingHouseId === house.id ? 'Eliminando...' : 'Eliminar'}
                                    </button>
                                  </div>
                                ) : null}
                              </div>
                            ) : null}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : null}
        </section>
      </section>
    </main>
  );
}

export default HomePage;
