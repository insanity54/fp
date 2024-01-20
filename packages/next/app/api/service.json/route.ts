import { NextResponse } from 'next/server'


const serviceConfig = {
    "cluster": {
      "peername": "replace-this-with-a-super-cool-peer-name",
      "secret": "3acade7f761c91f5fe3d34c4f4d15a17f817bc3463ab4395958f302b222a023b",
      "leave_on_shutdown": false,
      "listen_multiaddress": [
        "/ip4/0.0.0.0/tcp/9096"
      ],
      "connection_manager": {
        "high_water": 400,
        "low_water": 100,
        "grace_period": "2m0s"
      },
      "dial_peer_timeout": "3s",
      "state_sync_interval": "10m",
      "pin_recover_interval": "12m",
      "ipfs_sync_interval": "130s",
      "replication_factor_min": -1,
      "replication_factor_max": -1,
      "monitor_ping_interval": "30s",
      "peer_watch_interval": "10s",
      "mdns_interval": "10s",
      "disable_repinning": true,
      "follower_mode": true,
      "peer_addresses": [
        "/dns4/cluster.sbtp.xyz/tcp/9096/p2p/12D3KooWJmCsFadow1UvqAqCGtuKpqrS3puyPUYujJj4dRRCTfXf"
      ]
    },
    "consensus": {
      "crdt": {
        "cluster_name": "futureporn.net",
        "trusted_peers": [
            "12D3KooWJmCsFadow1UvqAqCGtuKpqrS3puyPUYujJj4dRRCTfXf"
        ],
        "rebroadcast_interval": "1m",
        "peerset_metric": "ping",
        "batching": {
          "max_batch_size": 0,
          "max_batch_age": "0s",
          "max_queue_size": 50000
        }
      }
    },
    "ipfs_connector": {
      "ipfshttp": {
        "node_multiaddress": "/ip4/127.0.0.1/tcp/5001",
        "connect_swarms_delay": "30s",
        "ipfs_request_timeout": "5m",
        "repogc_timeout": "24h",
        "pin_timeout": "3m",
        "unpin_timeout": "3h",
        "unpin_disable": false
      }
    },
    "pin_tracker": {
      "stateless": {
        "max_pin_queue_size": 1000000,
        "concurrent_pins": 8,
        "priority_pin_max_age" : "24h",
        "priority_pin_max_retries" : 5
      }
    },
    "monitor": {
      "pubsubmon": {
        "check_interval": "15s",
        "failure_threshold": 3
      }
    },
    "informer": {
      "disk": {
        "metric_ttl": "5m",
        "metric_type": "freespace"
      },
      "tags": {
        "metric_ttl": "30s",
        "tags": {}
      }
    },
    "allocator": {
      "balanced": {
        "allocate_by": ["freespace"]
      }
    },
    "observations": {
      "metrics": {
        "enable_stats": false,
        "prometheus_endpoint": "/ip4/0.0.0.0/tcp/8888",
        "reporting_interval": "2s"
      },
      "tracing": {
        "enable_tracing": false,
        "jaeger_agent_endpoint": "/ip4/0.0.0.0/udp/6831",
        "sampling_prob": 0.3,
        "service_name": "cluster-daemon"
      }
    },
    "datastore": {
      "badger": {
        "gc_discard_ratio": 0.2,
        "gc_interval": "15m0s",
        "gc_sleep": "10s",
        "badger_options": {
          "dir": "",
          "value_dir": "",
          "sync_writes": true,
          "table_loading_mode": 0,
          "value_log_loading_mode": 0,
          "num_versions_to_keep": 1,
          "max_table_size": 67108864,
          "level_size_multiplier": 10,
          "max_levels": 7,
          "value_threshold": 32,
          "num_memtables": 5,
          "num_level_zero_tables": 5,
          "num_level_zero_tables_stall": 10,
          "level_one_size": 268435456,
          "value_log_file_size": 1073741823,
          "value_log_max_entries": 1000000,
          "num_compactors": 2,
          "compact_l_0_on_close": true,
          "read_only": false,
          "truncate": false
        }
      }
    }
  }
  
export const dynamic = 'force-dynamic'
export async function GET() {
    const options = {
        headers: {
            "Content-Type": "application/json",
        }
    };
    return new NextResponse(JSON.stringify(serviceConfig), options);
}