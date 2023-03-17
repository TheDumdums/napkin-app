from django.test import TestCase

# Create your tests here.
class TestCaseTesting(TestCase):
    #Sign up and login test
    def test_register_user(self):
        #Sign up with new user
        response = self.client.post('/signUp/', data={
            'username': 'UnitTest',
            'email': 'UnitTest@example.com',
            'password': 'ShhhUnitTesting',
            'password2': 'ShhhUnitTesting',
        }, follow_redirects=True)
        assert response.status_code == 200

        # login with new user
        response = self.client.post('/signIn/', data={
            'email': 'UnitTest@example.com',
            'password': 'ShhhUnitTesting',
        }, follow_redirects=True)
        assert response.status_code == 200

    #make sure that logging in without being authenticated boots you to the unlogged in page.
    def test_restricted_login(self):
        response = self.client.get('/signInReturn')
        assert response.status_code == 403

    #make sure that trying to view napkins without being authenticated boots you to the unlogged in page.
    def test_restricted_gallery(self):
        response = self.client.get('/view')
        assert response.status_code == 403