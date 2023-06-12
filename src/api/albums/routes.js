const defaultRoutePath = 'albums';

const routes = (handler) => [{
    method: 'POST',
    path: `/${defaultRoutePath}`,
    handler: handler.postAlbumHandler,
  },
  // {
  //   method: 'GET',
  //   path: `/${defaultRoutePath}`,
  //   handler: handler.getAlbumsHandler,
  // },
  {
    method: 'GET',
    path: `/${defaultRoutePath}/{id}`,
    handler: handler.getAlbumByIdHandler,
  },
  {
    method: 'PUT',
    path: `/${defaultRoutePath}/{id}`,
    handler: handler.putAlbumByIdhandler,
  },
  {
    method: 'DELETE',
    path: `/${defaultRoutePath}/{id}`,
    handler: handler.deleteAlbumByIdHandler,
  },
];


module.exports = routes;