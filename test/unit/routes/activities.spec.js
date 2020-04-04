const activities = require('../../../routes/activities')
const activitiesService = require('../../../services/activitiesService')
const httpMocks = require("node-mocks-http");

describe('get', () => {
  let activitiesStub
  beforeEach(() => {
    activitiesStub = jest.spyOn(activitiesService, 'search').mockReturnValue({body: 'some stuff'})
  })
  it('is a function', () => {
    const expected = 'function'

    const result = typeof activities
    expect(result).toEqual(expected)
  })
  it('mocks', () => {
    const mockRequest = httpMocks.createRequest({
      method: "GET",
      url: "/activities"
    });
    const mockResponse = httpMocks.createResponse();

    activities(mockRequest, mockResponse)
    const actualResponseBody = mockResponse._getData()
    const expectedResponseBody = "hello world!"
    expect(actualResponseBody).toEqual(expectedResponseBody)
  })
})