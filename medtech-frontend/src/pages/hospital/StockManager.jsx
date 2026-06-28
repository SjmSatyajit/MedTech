import React, { useEffect, useState, useCallback } from 'react';
import { getHospitalResources, updateQuantity, addResource } from '../../api/resourceAPI';
import { toast } from 'react-toastify';

const RESOURCE_TYPES = ['BLOOD', 'ICU_BED', 'OXYGEN_CYLINDER', 'AMBULANCE'];

export default function StockManager({ hospitalId }) {
  const [resources, setResources] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newResource, setNewResource] = useState({ resourceType: 'BLOOD', subType: '', quantity: 0, unit: '' });

  const fetchResources = useCallback(() => {
    getHospitalResources(hospitalId).then(res => setResources(res.data));
  }, [hospitalId]);

  useEffect(() => { fetchResources(); }, [fetchResources]);

  const handleQuantityUpdate = async (resourceId, quantity) => {
    try {
      await updateQuantity(resourceId, quantity);
      toast.success('Quantity updated');
      fetchResources();
    } catch {
      toast.error('Update failed');
    }
  };

  const handleAddResource = async () => {
    try {
      await addResource({ ...newResource, hospitalId });
      toast.success('Resource added');
      setShowAdd(false);
      fetchResources();
    } catch {
      toast.error('Failed to add resource');
    }
  };

  const getUnitForType = (type) => {
    const units = { BLOOD: 'units', ICU_BED: 'beds', OXYGEN_CYLINDER: 'cylinders', AMBULANCE: 'vehicles' };
    return units[type] || '';
  };

  return (
    <div>
      <div className="d-flex justify-content-end mb-3">
        <button className="btn btn-sm btn-danger" onClick={() => setShowAdd(!showAdd)}>
          {showAdd ? 'Cancel' : '+ Add Resource'}
        </button>
      </div>

      {showAdd && (
        <div className="card mb-3 p-3" style={{ borderRadius: 12 }}>
          <div className="row g-2">
            <div className="col-md-4">
              <select className="form-select form-select-sm"
                value={newResource.resourceType}
                onChange={e => setNewResource({ ...newResource, resourceType: e.target.value, unit: getUnitForType(e.target.value) })}>
                {RESOURCE_TYPES.map(t => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
              </select>
            </div>
            <div className="col-md-3">
              <input type="text" className="form-control form-control-sm" placeholder="Sub type"
                value={newResource.subType} onChange={e => setNewResource({ ...newResource, subType: e.target.value })} />
            </div>
            <div className="col-md-2">
              <input type="number" className="form-control form-control-sm" placeholder="Qty"
                value={newResource.quantity} onChange={e => setNewResource({ ...newResource, quantity: Number(e.target.value) })} />
            </div>
            <div className="col-md-3">
              <button className="btn btn-sm btn-danger w-100" onClick={handleAddResource}>Add</button>
            </div>
          </div>
        </div>
      )}

      <div className="card" style={{ borderRadius: 12, border: 'none', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th>Resource</th>
                <th>Sub Type</th>
                <th>Quantity</th>
                <th>Unit</th>
                <th>Available</th>
                <th>Update</th>
              </tr>
            </thead>
            <tbody>
              {resources.map(r => (
                <tr key={r.resourceId}>
                  <td>{r.resourceType?.replace('_', ' ')}</td>
                  <td>{r.subType || '-'}</td>
                  <td>{r.quantity}</td>
                  <td>{r.unit}</td>
                  <td>{r.available ? <span className="badge bg-success">Yes</span> : <span className="badge bg-danger">No</span>}</td>
                  <td>
                    <input type="number" className="form-control form-control-sm" style={{ width: 80 }}
                      defaultValue={r.quantity}
                      onBlur={e => {
                        const val = Number(e.target.value);
                        if (val !== r.quantity) handleQuantityUpdate(r.resourceId, val);
                      }} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
