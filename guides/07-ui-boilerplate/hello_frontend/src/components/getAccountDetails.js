import FixedMenuLayout from '../layout/header';
import { Form, Button, Container, Divider } from 'semantic-ui-react';

function GetAccountDetails() {
    return (
        <div>
            <FixedMenuLayout />
            <Container>
                <h2>Account details</h2>
                <p>Get account details by submitting a Klayr32 address.</p>
                <Divider></Divider>
                <div class="ui two column doubling stackable grid container">
                    <div class="column">
                        <Form >
                            <Form.Field>
                                <label>Klayr32 address:</label>
                                <input placeholder="Klayr32 address" id="address" name="address" />
                            </Form.Field>
                            <Button type='submit' fluid size='large' style={{ backgroundColor: '#0D75FD', color: 'white' }}>Submit</Button>
                        </Form>
                    </div>

                    <div className='column'>
                    </div>
                </div>
            </Container >
        </div >
    );
}

export default GetAccountDetails;