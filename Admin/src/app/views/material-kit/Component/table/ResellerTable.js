import Api from 'Service/Api';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import dateFormat from 'dateformat';
import DataTable from 'react-data-table-component';
import { Button, Fab, Icon, IconButton } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { differenceBy } from 'lodash';

import Get from '../Function/Get';
import Update from '../Function/Update';
import ActionSweet from '../AddCompnent/Dialog/ActionSweet';
import ConfirmedSweet from '../AddCompnent/Dialog/ConfirmedSweet';
import CancelledSweet from '../AddCompnent/Dialog/CancelledSweet';
import Swal from 'sweetalert2';

export default function ResellerssTable() {
  const [selectedRows, setSelectedRows] = React.useState([]);
  const [toggleCleared, setToggleCleared] = React.useState(false);
  var navigator = useNavigate();

  var [ResellersTabledata, setResellersTabledata] = useState([]);
  var [Search, setSearchTable] = useState('');
  var [ResellersTabledataFilter, setResellersTabledataFilter] = useState([]);

  const handleResponse = (response) => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  };
  const handleError = (error) => {
    console.log('Error fetching user role:', error);
  };

  var getResellersData = async () => {
    Get(`${Api.TestimonialsGetApi}?RoleTestimanial=${'Reseller'}`)
      .then(handleResponse)
      .then(processGet)
      .catch(handleError);
  };

  const processGet = (result) => {
    if (result.Status) {
      setResellersTabledata(result.result);
      setResellersTabledataFilter(result.result);
    } else {
      setResellersTabledata(result.result);
      setResellersTabledataFilter(result.result);
    }
  };
  const ResellerssTrashed = async (Testimonialid) => {
    var raw = JSON.stringify({
      TestimanialisActive: false
    });

    Update(`${Api.TestimonialsGetApi}?Testimonialid=${Testimonialid}`, raw)
      .then(handleResponse)
      .then(processUpdate)
      .catch(handleError);
  };

  const processUpdate = (data) => {
    if (data.Status) {
      getResellersData();
    } else {
      getResellersData();
    }
  };
  useEffect(() => {
    getResellersData();
  }, []);
  var ResellersUpdate = (id) => {
    navigator(`/backend/update-reseller?resellerId=${id}`);
  };
  var Restores = (id) => {
    ActionSweet('Trash').then((result) => processTrash(result, id));
  };

  const processTrash = (result, id) => {
    if (result.isConfirmed) {
      ResellerssTrashed(id);
      ConfirmedSweet('Trash');
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      CancelledSweet();
      setSelectedRows([]);
      setToggleCleared(!toggleCleared);
    }
  };

  var columns = [
    {
      name: 'Name',
      selector: (row) => {
        if (row.TestimanialisActive == true) {
          return (
            <>
              <p dangerouslySetInnerHTML={{ __html: row.TestimonialName }} />
            </>
          );
        }
      },
      sortable: true
    },
    {
      name: ' Company Name',
      selector: (row) => {
        if (row.TestimanialisActive == true) {
          return (
            <>
              <p dangerouslySetInnerHTML={{ __html: row.CompanyName }} />
            </>
          );
        }
      },
      sortable: true
    },
    {
      name: ' Date',
      selector: (row) => {
        if (row.TestimanialisActive == true) {
          return (
            <>
              <span>
                Published <br></br> {dateFormat(row.CreatedDate, 'mmmm dS, yyyy')}{' '}
              </span>
            </>
          );
        }
      },

      sortable: true
    },

    {
      name: 'feature Image',
      selector: (row) => {
        if (row.TestimanialisActive == true) {
          return (
            <>
              {' '}
              <img
                className="Image-table"
                src={row.TestimonialImage ? `${Api.BaseURL}/${row.TestimonialImage}` : '/demo.png'}
              />
            </>
          );
        }
      },

      sortable: true
    },
    {
      name: <div class="form-check-inline m-4 mb-0 mt-0 text-center">Action</div>,
      cell: (row) => {
        if (row.TestimanialisActive == true) {
          return (
            <>
              <>
                <IconButton>
                  <Fab
                    className="button democss"
                    color="secondary"
                    aria-label="Edit"
                    onClick={() => ResellersUpdate(row.Testimonialid)}
                  >
                    <Icon className="democssicon">edit_icon</Icon>
                  </Fab>
                </IconButton>{' '}
                <IconButton>
                  <Fab
                    onClick={() => Restores(row.Testimonialid)}
                    className="button democss"
                    aria-label="Delete"
                    variant="outlined"
                  >
                    <Icon className="democssicon">delete</Icon>
                  </Fab>
                </IconButton>
              </>
            </>
          );
        }
      },
      sortable: true
    }
  ];

  useEffect(() => {
    var result = ResellersTabledata.filter((Resellers) => {
      setSelectedRows([]);
      setToggleCleared(!toggleCleared);
      if (Resellers.TestimanialisActive == true) {
        return Resellers.TestimonialName.toLowerCase().includes(Search.toLowerCase());
      }
    });
    setResellersTabledataFilter(result);
  }, [Search, ResellersTabledata]);

  const actions = <></>;

  const handleRowSelected = React.useCallback((state) => {
    setSelectedRows(state.selectedRows);
  }, []);

  const contextActions = React.useMemo(() => {
    const handleDelete = () => {
      const Id = selectedRows.map((r) => r.Testimonialid);
      const TestimonalID = Id.toString();

      if (TestimonalID != null) {
        Restores(TestimonalID);
        setResellersTabledataFilter(differenceBy(ResellersTabledataFilter, 'TestimonialName'));
      }
    };

    return (
      <Button
        key="delete"
        onClick={handleDelete}
        className="btn-primary form-control  w-50 w-auto btn-class "
      >
        Trash
      </Button>
    );
  }, [
    ResellersTabledataFilter,
    selectedRows,
    setResellersTabledataFilter,
    setToggleCleared,
    toggleCleared,
    Api.TestimonialsGetApi
  ]);
  return (
    <div>
      <DataTable
        data={ResellersTabledataFilter}
        style={{ width: '100%' }}
        columns={columns}
        pagination
        fixedHeader
        fixedHeaderScrollHeight="auto"
        selectableRowsHighlight
        subHeader
        selectableRows
        actions={actions}
        contextActions={contextActions}
        onSelectedRowsChange={handleRowSelected}
        clearSelectedRows={toggleCleared}
        subHeaderComponent={
          <>
            <div class="jBBxnG justify-content-end justify-content-lg-start">
              <h6 className=" m-1 mb-4">
                <img src="/loupe.png" style={{ width: '18px' }} /> Search :
              </h6>
              <input
                type="text"
                placeholder="Search by keyword...."
                className=" form-control m-1 mb-4 w-auto"
                value={Search}
                onChange={(e) => setSearchTable(e.target.value)}
              />
            </div>
            <div class="jBBxnG justify-content-end mb-3 justify-content-lg-start">
              <Link
                key="add"
                to="/backend/manage-reseller"
                className="btn-primary form-control mb-4 w-50 w-auto btn-class"
              >
                <img src="/add.png" width={16} style={{ filter: ' invert(1)' }} /> Add Resellers
              </Link>
            </div>
          </>
        }
        subHeaderAlign="right"
      />
    </div>
  );
}
