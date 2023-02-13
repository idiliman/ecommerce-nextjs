import Layout from '@/components/Layout';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';
// import data from '@/utils/data';
import { Store } from '@/utils/Store';
import db from '@/utils/db';
import Product from '@/models/Product';
import axios from 'axios';
import { toast } from 'react-toastify';

function ProductSreen(props) {
  const { product } = props;
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { cart } = state;

  const smtg = router.query;
  console.log('query', smtg);

  // console.log('ProductId', product._id);
  // const { query } = useRouter();
  // const { slug } = query;
  // const product = data.products.find((x) => x.slug === slug);

  if (!product)
    return <Layout title="Product Not Found">Product Not Found</Layout>;

  const addToCartHandler = async () => {
    const existItem = cart.cartItems.find((x) => x.slug === product.slug);
    const quantity = existItem ? existItem.quantity + 1 : 1;

    const { data } = await axios.get(`/api/products/${product._id}`);

    // console.log('ProductId', product._id);
    // console.log('API data', data);

    if (data.countInStock < quantity) {
      return toast.error('Sorry, Product is out of stock');
    }

    dispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...product, quantity },
    });

    router.push('/cart');

    await console.log('addToCartHandler', state);
  };

  return (
    <Layout title={product.name}>
      <div className="py-2">
        <Link href="/">Back to products</Link>
      </div>

      <div className="grid md:grid-cols-4 md:gap-3">
        <div className="md:col-span-2">
          <Image
            src={product.image}
            width={800}
            height={800}
            alt={product.name}
            layout="responsive"
          />
        </div>

        <div>
          <ul>
            <li>
              <h1 className="text-lg">{product.name}</h1>
            </li>
            <li>Category: {product.category}</li>
            <li>Brand: {product.brand}</li>
            <li>
              {product.rating} of {product.numReviews} reviews
            </li>
            <li>Description: {product.description}</li>
          </ul>
        </div>

        <div>
          <div className="card p-5">
            <div className="mb-2 flex justify-between">
              <div>Price</div>
              <div>${product.price}</div>
            </div>
            <div className="mb-2 flex justify-between">
              <div>Status</div>
              <div>{product.countInStock > 0 ? 'In stock' : 'Unavailable'}</div>
            </div>
            <button
              onClick={addToCartHandler}
              className="primary-button w-full"
            >
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default ProductSreen;

export async function getServerSideProps(context) {
  const { params } = context;
  const { slug } = params;

  await db.connect();
  const product = await Product.findOne({ slug }).lean();
  await db.disconnect();
  return {
    props: {
      product: product ? db.convertDocToObj(product) : null,
    },
  };
}
