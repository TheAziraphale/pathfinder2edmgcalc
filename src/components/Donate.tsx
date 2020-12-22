//import React from 'react';
import { useState } from 'react';
import { PayPalButton } from 'react-paypal-button-v2';
import CurrencyInput from 'react-currency-input-field';

interface Props {
    onSuccess: () => void
}

const productionId = "ATrXcTp0UOYX284Nk3N7ujhUN3FsfmK6JDhSF9alhPqfbisNcxYVR5YkG6_CKdEBGBDr_GSSH6hH7Q0s";

export const Donate = (props: Props) => {
    const [amount, setAmount] = useState<string>('5');
    const onSuccess = (details, data) => {
            props.onSuccess();
            alert("Transaction completed by " + details.payer.name.given_name);

            // OPTIONAL: Call your server to save the transaction
            return fetch("/paypal-transaction-complete", {
                method: "post",
                body: JSON.stringify({
                    orderID: data.orderID
            })
        });
      }
      
      const onError = err => {
        console.log(err);
      };
      
    return (
        <div className={'donateContainer'}>
            <div className={'donateAmountWrapper'}>
                <p className={'donateAmountQuestionText'}>How much do you want to donate?</p>
                <CurrencyInput
                    className={'currencyInput'}
                    id="donate_input"
                    name="Donate input"
                    placeholder="$5"
                    defaultValue={5}
                    prefix={'$'}
                    tabIndex={2}
                    allowDecimals={true}
                    decimalsLimit={2}
                    onChange={(value, name) => {
                        setAmount(value);
                        console.log(value, name);
                    }}
                    allowNegativeValue={false}

                />
            </div>
            <PayPalButton
                amount={amount}
                onError={onError}
                onSuccess={onSuccess}
                options={{
                    clientId: productionId
                }}
            />
        </div>
    );
}

export default Donate;

/*
<div className={'donateAmountContainer'}>
                    <p className={'donateAmountText'}>$</p>


                    <input className={'inputNumberNoSpinner'} pr={'$'} type={'number'} value={amount} onChange={(event) => { 
                        setAmount(event.target.value)
                    }} />

                </div>

*/