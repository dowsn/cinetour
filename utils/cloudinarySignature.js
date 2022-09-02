export async function generateSignature(callback, paramsToSign) {
  fetch(`/api/cloudinary`, {
    method: 'POST',
    body: JSON.stringify({
      paramsToSign,
    }),
  })
    .then((r) => r.json())
    .then(({ signature }) => {
      callback(signature);
    })
    .catch(() => {
      console.log('Request fails');
    });
}
