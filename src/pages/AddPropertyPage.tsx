import { useNavigate } from 'react-router-dom';
import { propertiesApi } from '../api/properties';
import { emptyPropertyForm, PropertyForm } from '../components/PropertyForm';

export function AddPropertyPage() {
  const navigate = useNavigate();

  return (
    <div className="page">
      <div className="page-header">
        <h1>Add Property</h1>
        <p>Create a new listing for home seekers</p>
      </div>

      <PropertyForm
        initialValues={emptyPropertyForm}
        submitLabel="Create listing"
        submittingLabel="Creating..."
        onSubmit={async (values) => {
          const property = await propertiesApi.create(values);
          navigate(`/properties/${property.id}`);
        }}
      />
    </div>
  );
}
